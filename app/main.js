const fs = require('fs');
const path = require('path');

const { app, BrowserWindow, dialog, ipcMain, Tray, Menu, globalShortcut } = require('electron');

const wallpaper = require('wallpaper');

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

    desktopWindow = new BrowserWindow({ show: false, width: screenWidth, height: screenHeight, backgroundColor: '#2e2c29', opacity: 0.4, focusable: false, frame: false });

    mainWindow = new BrowserWindow({ show: false, width: 800, height: 800, center: true, backgroundColor: '#2e2c29', parent: desktopWindow, frame: false }); // webPreferences: { nodeIntegration: true }
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

    //     mainWindow.once('ready-to-show', () => {
    //     });
});


ipcMain.on('input-change', (event, backgroundName) => {
    fs.readdir(backgroundDirectory, async(error, files) => {
        if (error) {
            console.log(error);
        } else {
            console.log(files);
            const image = files.find((name) => name === backgroundName);
            await wallpaper.set(path.join(backgroundDirectory, image));
            desktopWindow.hide();
            mainWindow.minimize(); // minimizing restores focus to window
            mainWindow.hide(); // hiding stops mainWindow stops mainWindow from appearing as an open window in Windows alt+tab
            event.sender.send('background-set', files);
        }
    });
});

// const getFileFromUser = () => {
//     const files = dialog.showOpenDialog({
//         defaultPath: path.join(__dirname, '../assets'),
//         properties: ['openFile'],
//         title: 'Set Background Cheatsheet',
//         filters: [
//             { name: 'JPEG', extensions: ['jpg'] }
//         ]
//     });
//     if (!files) return;
//     const file = files[0];
//     console.log("Opened: " + file);
//     mainWindow.show();
// };

// ipcMain.on('asynchronous-message', (event, arg) => {
//     console.log(arg); // "ping"
//     getFileFromUser();
//     event.sender.send('asynchronous-reply', 'pong');
// });