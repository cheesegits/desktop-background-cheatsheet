const { ipcRenderer } = require('electron');

const openFileButton = document.querySelector('#open-file');

openFileButton.addEventListener('click', () => {
    ipcRenderer.send('asynchronous-message', 'ping');
    ipcRenderer.on('asynchronous-reply', (event, arg) => { // event not used
        console.log(arg); // "pong"
    });
});