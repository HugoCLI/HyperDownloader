const {app, BrowserWindow, Menu} = require('electron');
const checkingUpdate = require("./update");




class Window {
    constructor() {
        this.schemeList = {}
        this.schemeList.updater = {
            width: 500,
            height: 550,
            resizable: false,
            title: "HyperDownloader",
            frame: false,
            center: true,
            transparent: true,
            show: false,
            webPreferences: {
                webviewTag: true,
                nodeIntegration: true,
                contextIsolation: false
            }
        };
    }
    create(scheme) {
        Menu.setApplicationMenu(null);
        if (!scheme || !this.schemeList[scheme]) return console.log(`ERROR : Window scheme no found [${scheme}]`);
        let window = new BrowserWindow(this.schemeList[scheme]);
        window.loadFile(`./bin/render/${scheme}.html`);
        window.once('ready-to-show', () => {
            window.show();
            if (scheme === 'updater') return new checkingUpdate(window);
            window.maximize();
            window.setSkipTaskbar(true);

            return window;
        });
    }
}

module.exports = Window;