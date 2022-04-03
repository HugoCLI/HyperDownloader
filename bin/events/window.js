const {app, BrowserWindow, Menu} = require('electron');
const checkingUpdate = require("./update");

let schemeList = {};
schemeList.updater = {
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
schemeList.main = {
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
};


class createWindow {
    constructor(templateScheme = false) {
        Menu.setApplicationMenu(null);
        if (!templateScheme || !templateScheme.scheme || !schemeList[templateScheme.scheme]) return console.log(`ERROR : Window scheme no found [${templateScheme.scheme}]`);
        let window = new BrowserWindow(schemeList[templateScheme.scheme])
        window.loadFile(`./bin/render/${templateScheme.scheme}.html`);
        window.once('ready-to-show', () => {
            window.show();
            if (templateScheme.scheme === 'updater') return new checkingUpdate(window);
            window.maximize();
            window.setSkipTaskbar(true);
            return window;
           /* this.window.openDevTools();*/
        });
    }
}

module.exports = createWindow;