const {app, BrowserWindow} = require('electron');
const Window = require("./bin/events/window");

const start = async () => {
    new Window().create('updater');
}

app.whenReady().then(() => start());