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

    tray = new Tray('Google-Chrome-Google-Chrome.ico');
    tray.setToolTip('~~MAKE NEW ICON~~');
    tray.setContextMenu(contextMenu);

    mainWindow = new BrowserWindow({ show: false, width: 110, height: 100, x: 2216, y: 1588 });
    mainWindow.loadFile(`${__dirname}/index.html`);

    console.log(tray.getBounds()); // { x: 2248, y: 1688, width: 32, height: 40 }
    console.log(mainWindow.getBounds()); // { x: 1385, y: 564, width: 301, height: 600 }



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