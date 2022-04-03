const {app, BrowserWindow, Menu} = require('electron');
let schemeList = {};
schemeList.updater = {
    width: 500,
    height: 550,
    resizable: false,
    title: "HyperDownloader",
    frame: false,
    center: true,
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

        if (templateScheme && templateScheme.scheme && schemeList[templateScheme.scheme]) {
            this.window = new BrowserWindow(schemeList[templateScheme.scheme])
            this.window.loadFile(`./bin/render/${templateScheme.scheme}.html`);
        }
        else console.log(`ERROR : Window scheme no found [${templateScheme.scheme}]`);
    }


}
module.exports = createWindow;