const fs = require('fs');
const path = require('path');

const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron');

const wallpaper = require('wallpaper');
const ks = require('node-key-sender');

const backgroundDirectory = path.join(__dirname, '../assets');
const directoryFiles = [];

let desktopWindow = null;
let mainWindow = null;
let tray = null;

app.on('ready', () => {
    const { screen } = require('electron');

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
        opacity: 0.8,
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
    mainWindow.webContents.openDevTools();

    globalShortcut.register('Alt+D', () => {
        if (mainWindow.isFocused()) {
            desktopWindow.hide();
            mainWindow.minimize();
            mainWindow.hide();
        } else {
            desktopWindow.show();
            mainWindow.show();
        }
    });

    tray = new Tray('Google-Chrome-Google-Chrome.ico'); // does not automatically remove tray icon on exit
    tray.setToolTip('~~MAKE NEW ICON~~');
    tray.setContextMenu(contextMenu);
});

fs.readdir(backgroundDirectory, (_, files) => {
    for (var i = 0; i < files.length; i++) {
        directoryFiles.push(files[i]);
    }
});

ipcMain.on('key-press', (event, text) => {
    try {
        const matchingFiles = directoryFiles.filter((files) => {
            return files.toLowerCase().match(text.toLowerCase());
        });
        event.sender.send('files-match', matchingFiles);

    } catch (error) {
        console.log('err', error);
    }
});
ipcMain.on('input-change', (event, backgroundName) => {
    fs.readdir(backgroundDirectory, (error, files) => {
        if (error) {
            console.log(error);
        } else {
            const image = files.find((name) => name === backgroundName);
            if (!image) {
                return;
            }
            wallpaper.set(path.join(backgroundDirectory, image)).then(() => {
                desktopWindow.hide();
                mainWindow.minimize();
                mainWindow.hide();
                event.sender.send('background-set');
                ks.sendCombination(['windows', 'd']).then((a) => {
                    console.log(a);
                });
            }).catch((error) => {
                console.log(error);
            });
        }
    });
});