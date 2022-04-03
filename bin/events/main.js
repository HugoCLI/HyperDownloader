
const createWindow = require("./window");


class main {
    constructor(obj) {
        if(obj.updater) this.updater = obj.updater;
        this.start();
    }

    start() {
        const createWindow = require("./window");
        this.main = new createWindow({scheme: 'main'});
        this.updater.parent = this.main;
        this.updater.focus();
    }


}
module.exports = main;