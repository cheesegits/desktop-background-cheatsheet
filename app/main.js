const fs = require('fs');
const path = require('path');

const { app, BrowserWindow, dialog, ipcMain, Tray, Menu, globalShortcut } = require('electron');

const wallpaper = require('wallpaper');

const backgroundDirectory = path.join(__dirname, '../assets');

let mainWindow = null;
let tray = null;

const getFileFromUser = () => {
    const files = dialog.showOpenDialog({
        defaultPath: path.join(__dirname, '../assets'),
        properties: ['openFile'],
        title: 'Set Background Cheatsheet',
        filters: [
            { name: 'JPEG', extensions: ['jpg'] }
        ]
    });
    if (!files) return;
    const file = files[0];
    console.log("Opened: " + file);
    mainWindow.show();
};

app.on('ready', () => {
    const { screen } = require('electron'); // could not require() at the top of file, but this worked around

    const contextMenu = Menu.buildFromTemplate([{
        label: 'Set Background Cheatsheet',
        click: () => {
            mainWindow.show();
            getFileFromUser();
        },
    }]);

    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    const mainWindowHeight = 800;
    const mainWindowWidth = 800;

    const mainWindowX = screenWidth / 2 - mainWindowWidth / 2;
    const mainWindowY = screenHeight / 2 - mainWindowHeight / 2;

    mainWindow = new BrowserWindow({ show: true, width: mainWindowWidth, height: mainWindowHeight, x: mainWindowX, y: mainWindowY }); // webPreferences: { nodeIntegration: true },
    mainWindow.loadFile(`${__dirname}/index.html`);
    mainWindow.webContents.openDevTools();

    globalShortcut.register('Shift+Alt+2', () => {
        getFileFromUser();
    });

    tray = new Tray('Google-Chrome-Google-Chrome.ico');
    tray.setToolTip('~~MAKE NEW ICON~~');
    tray.setContextMenu(contextMenu);

    // mainWindow.once('ready-to-show', () => {
    //     mainWindow.show();
    // });
});

ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg); // "ping"
    getFileFromUser();
    event.sender.send('asynchronous-reply', 'pong');
});

ipcMain.on('input-change', (event, backgroundName) => { // event not used
    fs.readdir(backgroundDirectory, async(error, files) => {
        if (error) {
            console.log(error);
        } else {
            console.log(files);
            const image = files.find((name) => name === backgroundName);
            await wallpaper.set(path.join(backgroundDirectory, image));
            event.sender.send('background-set', files);
        }
    });
});