const { app, BrowserWindow } = require('electron');
const createWindow = require("./bin/events/window");


const start = () => {
    const screenUpdater = new createWindow({scheme: 'updater'});
}

app.whenReady().then(() => start());