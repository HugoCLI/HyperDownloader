
const {app, BrowserWindow, Menu} = require('electron');


class main {
    constructor(obj) {
        if(obj.updater) this.updater = obj.updater;
        this.start();
    }

    start() {

        this.window = new BrowserWindow({
            height: 715,
            width: 1200,
            minWidth: 600,

            minHeight: 400,
            center: true,
            title: "HyperDownloader",
            frame: false,
            resizable: true,
            show:false,
            transparent: true,
            webPreferences: {
                webviewTag: true,
                nodeIntegration: true,
                contextIsolation: false
            }
        });
        this.window.loadFile(`./bin/render/main.html`);
        this.window.once('ready-to-show', () => {
            this.window.show();
            this.window.maximize();
            this.window.setSkipTaskbar(true);
        });

        this.updater.setAlwaysOnTop(true, 'pop-up-menu');
        this.updater.focus();
        setTimeout(() => this.ready(), 2000);
    }

    ready() {
        this.window.setSkipTaskbar(false);

        this.window.webContents.send('ready-show', {});
        this.window.openDevTools();
        this.updater.close();
        this.window.focus();
    }


}
module.exports = main;