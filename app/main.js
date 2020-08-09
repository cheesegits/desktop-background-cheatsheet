const fs = require('fs');
const path = require('path');

const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron');

const wallpaper = require('wallpaper');
const ks = require('node-key-sender');

const backgroundDirectory = path.join(__dirname, '../assets');

let desktopWindow = null;
let mainWindow = null;
let tray = null;


app.on('ready', () => {
    const { screen } = require('electron'); // could not require() at the top of file, but this served as a work around

    const contextMenu = Menu.buildFromTemplate([{
        label: 'Set Background Cheatsheet',
        click: () => {
            desktopWindow.show();
            mainWindow.show();
        },
    }]);

    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    desktopWindow = new BrowserWindow({
        show: false,
        width: screenWidth,
        height: screenHeight,
        backgroundColor: '#2e2c29',
        opacity: 0.4,
        focusable: false,
        frame: false,
    });

    mainWindow = new BrowserWindow({
        show: false,
        width: 800,
        height: 800,
        center: true,
        backgroundColor: '#2e2c29',
        parent: desktopWindow,
        webPreferences: { nodeIntegration: true },
        frame: false,
    });
    mainWindow.loadFile(`${__dirname}/index.html`);
    // mainWindow.webContents.openDevTools();

    globalShortcut.register('Shift+Alt+2', () => {
        if (mainWindow.isFocused()) {
            desktopWindow.hide();
            mainWindow.minimize();
            mainWindow.hide();
        } else {
            desktopWindow.show();
            mainWindow.show();
        }
    });

    tray = new Tray('Google-Chrome-Google-Chrome.ico');
    tray.setToolTip('~~MAKE NEW ICON~~');
    tray.setContextMenu(contextMenu);
});

ipcMain.on('input-change', (event, backgroundName) => {
    fs.readdir(backgroundDirectory, (error, files) => {
        if (error) {
            console.log(error);
        } else {
            const image = files.find((name) => name === backgroundName);
            wallpaper.set(path.join(backgroundDirectory, image)).then(() => {
                desktopWindow.hide();
                mainWindow.minimize();
                mainWindow.hide();
                event.sender.send('background-set', files);
                ks.sendCombination(['windows', 'd']).then((a) => {});
            }).catch((error) => {
                console.log(error);
            });
        }
    });
});