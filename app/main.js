// const fs = require('fs');
const path = require('path');

const { app, BrowserWindow, dialog, ipcMain, Tray, Menu, globalShortcut } = require('electron');

let mainWindow = null;
let tray = null;

console.log(`${__dirname} is the __dirname`);
console.log(path.relative(__dirname, '/assets'));

const getFileFromUser = () => {
    const files = dialog.showOpenDialog({
        defaultPath: path.join(__dirname, '../assets'),
        properties: ['openFile'],
        // buttonLabel: 'Unveil',
        title: 'Set Background Cheatsheet',
        filters: [
            { name: 'JPEG', extensions: ['jpg'] }
        ]
    });
    if (!files) return;
    // console.log(files);
    const file = files[0];
    console.log("Opened: " + file);
    mainWindow.show();
    // const content = fs.readFileSync(file).toString();
    // console.log(content);
};

app.on('ready', () => {
    const { screen } = require('electron');

    const contextMenu = Menu.buildFromTemplate([{
        label: 'Set Background Cheatsheet',
        click: () => {
            mainWindow.show();
            getFileFromUser();
        },
    }]);

    globalShortcut.register('Shift+Alt+2', () => {
        // console.log('Shift+Alt+2 is pressed');
        getFileFromUser();
    });

    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
    console.log(screenWidth);
    console.log(screenHeight);
    const mainWindowHeight = 800;
    const mainWindowWidth = 800;

    const mainWindowX = screenWidth / 2 - mainWindowWidth / 2;
    const mainWindowY = screenHeight / 2 - mainWindowHeight / 2;



    tray = new Tray('Google-Chrome-Google-Chrome.ico');
    tray.setToolTip('~~MAKE NEW ICON~~');
    tray.setContextMenu(contextMenu);

    mainWindow = new BrowserWindow({ show: true, width: mainWindowWidth, height: mainWindowHeight, x: mainWindowX, y: mainWindowY }); // webPreferences: { nodeIntegration: true },
    mainWindow.loadFile(`${__dirname}/index.html`);

    // console.log(tray.getBounds()); // { x: 2248, y: 1688, width: 32, height: 40 }
    console.log(mainWindow.getBounds());

    // mainWindow.once('ready-to-show', () => {
    //     mainWindow.show();
    // });
});


ipcMain.on('asynchronous-message', (event, arg) => {
    console.log(arg); // prints "ping"
    getFileFromUser();
    event.sender.send('asynchronous-reply', 'pong');
    // event.sender.send('pong');
});

// // Synchronous example only
// ipcMain.on('synchronous-message', (event, arg) => {
//     setTimeout(() => {
//         console.log(arg); // prints "pingy"
//         event.returnValue = 'pongy';
//     }, 3000);
// });