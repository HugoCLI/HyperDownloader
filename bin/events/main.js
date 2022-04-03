
const createWindow = require("./window");


class main {
    constructor(obj) {
        if(obj.updater) this.updater = obj.updater;
        this.start();
    }

    start() {
        const createWindow = require("./window");
        this.main = new createWindow({scheme: 'main'});
        this.updater.setAlwaysOnTop(false, 'pop-up-menu');
        this.updater.focus();
        setTimeout(() => this.ready(), 2000);
    }

    ready() {
        this.updater.close();
        console.log(this.main);
        this.main.setSkipTaskbar(false);
    }


}
module.exports = main;