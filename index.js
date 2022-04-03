const {app, BrowserWindow} = require('electron');
const createWindow = require("./bin/events/window");

const start = async () => {
    const screenUpdater = new createWindow({scheme: 'updater'});
}

app.whenReady().then(() => start());