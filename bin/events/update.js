const axios = require('axios');
const c = require("cli-color");
const {ipcMain, app} = require('electron');
const unzipper = require('unzipper');
const walk = require('walk');

let prefix_warn = '(' + c.yellow('WARN') + ')';
const fs = require('fs')
let path = process.cwd() + '\\bin\\configs\\';


class checkingUpdate {
    constructor(window) {

        this.window = window;
        this.window.webContents.send('progress', {status: 0});
        this.releaseDownload;
        setTimeout(() => this.checkUpdate(), 1000);
    }

    checkUpdate() {

        fs.readFile(path + 'version.json', 'utf8', (err, data) => {


            if (err) return this.createConfig();


            data = JSON.parse(data);
            if (!data.version) return this.createConfig({erease: true});
            this.window.webContents.send('progress', {status: 2});
            axios.get('https://api.github.com/repos/HugoCLI/HyperDownloader/releases')
                .then(response => {
                    let release;
                    let index = 0;
                    while (index < response.data.length) {
                        if (!release)
                            if (response.data[index].tag_name.match(/(v){1}([0-9])(.)([0-9])(.)([0-9])(-)([0-9]){8}/g)) {
                                release = response.data[index];
                                this.releaseDownload = release;
                                break;
                            }
                        release++;
                    }

                    console.log(prefix_warn + ' Server version is ' + c.cyan(release.tag_name));
                    if (release.tag_name !== data.version) {
                        this.window.webContents.send('progress', {status: 3});
                        this.startDownload(release);
                    } else {
                        this.window.webContents.send('progress', {status: 4});
                    }

                })
                .catch(error => {
                    console.log(error);
                });

        })

    }

    createConfig() {
        this.window.webContents.send('progress', {status: 1});
        fs.mkdir(path, function (err) {
            if (!err) console.log(prefix_warn + ' configs/ successfully created');
        });

        fs.readFile(path + 'version.json', 'utf8', (err, data) => {
            if (err) {
                fs.writeFile(path + 'version.json', JSON.stringify({
                    version: 'new-user',
                    beta: false,
                    node_id: null
                }), function (error) {
                    if (!error) return console.log(prefix_warn + ' version.json successfully created');
                });
            }
        });
        setTimeout(() => this.checkUpdate(), 2000);
    }


    async startDownload(release) {
        console.log(prefix_warn + ' Downloading ' + c.cyan(release.tag_name) + ' on ' + c.yellow(release.zipball_url));

        const {data, headers} = await axios({
            url: release.zipball_url,
            method: "GET",
            responseType: "stream",
        });

        const total = headers['content-length'];

        let downloaded = 0;
        data.on('data', (chunk) => {
            downloaded += chunk.length;
            let prc = 100 / total * downloaded;
            this.window.webContents.send('progress', {status: 3, progress: prc.toFixed(0)});
        })

        data.pipe(fs.createWriteStream(process.cwd() + '\\bin\\' + release.tag_name + ".zip"));
        data.on('end', async () => {
            console.log(prefix_warn + ' ' + c.cyan(release.tag_name) + ' have been saved');
            this.window.webContents.send('progress', {status: 6});
            setTimeout(async() => {

                let zip = fs.createReadStream(process.cwd() + '\\bin\\' + release.tag_name + ".zip");
                await zip.pipe(await unzipper.Extract({path: process.cwd() + '\\bin\\'}));


                console.log(prefix_warn + ' ' + c.cyan(release.tag_name) + ' have been unzipped ');
                await new Promise(r => setTimeout(r, 500));
                let folder;
                fs.unlink(process.cwd() + '\\bin\\' + release.tag_name + ".zip", (err) => {
                    if(err) return;
                    fs.readdir(process.cwd() + '\\bin\\', (err, files) => {
                        files.forEach((elm) => {
                            console.log(elm);
                            if (elm.startsWith('HugoCLI') && !folder) folder = this.installRelease(elm);

                        })
                    });
                });



            }, 2000);
        });

    }

    installRelease(release) {
        this.window.webContents.send('progress', {status: 5});
        console.log(process.cwd() + '\\bin\\'+ release);
        let maj = walk.walk(process.cwd() + '\\bin\\'+ release, { followLinks: false });

        let files = [];
        maj.on('file', (root, stat, next) => {
            console.log(prefix_warn + ' Found ' + c.cyan(stat.name) + ' in new release');
            let chemin = root.split(release)[1];
            files.push({target: process.cwd() + chemin+'\\'+stat.name, focus: root+'\\'+stat.name, name: stat.name });
            /* console.log(chemin+'\\'+stat.name);*/
            next();
        });

        maj.on('end', () => {

            let index = 0;
            const loop = () => {
                if(index < files.length) {
                    const file = files[index];
                    const prc = 100 / files.length * index+1;
                    this.window.webContents.send('progress', {status: 5, progress:prc.toFixed(0), target: file.name });
                    fs.readFile(file.focus, function read(err, data) {
                        if (err) throw err;

                        const content = data;
                        fs.unlink(file.target, (err) => {
                            if(err) return;
                            console.log(prefix_warn + ' Deleting ' + c.cyan(file.name) + ' successfully');
                            fs.writeFile(file.target, content, function (err) {
                                if (err) throw err;
                                console.log(prefix_warn + ' Created ' + c.cyan(file.name) + ' successfully');
                                setTimeout(() => { index+=1; loop() }, 25);
                            });

                        })
                    });



                } else {
                    this.window.webContents.send('progress', {status: 7 });
                    console.log(this.releaseDownload);
                    let json = {version: this.releaseDownload.tag_name, node_id: this.releaseDownload.id, beta: false  }
                    fs.unlink( process.cwd()+"\\bin\\configs\\version.json", (err) => {
                        if(err) return;
                        fs.writeFile( process.cwd()+"\\bin\\configs\\version.json", JSON.stringify(json), function (err) {
                            setTimeout(() => {
                                app.relaunch();
                                this.window.close();
                            }, 3000)
                        });
                    });

                }
            }
            loop();
        });



    }
}

module.exports = checkingUpdate;