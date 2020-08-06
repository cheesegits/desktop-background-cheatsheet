const { ipcRenderer } = require('electron');

const openFileButton = document.querySelector('#open-file');
const input = document.querySelector('.input-field');

openFileButton.addEventListener('click', () => {
    ipcRenderer.send('asynchronous-message', 'ping');
    ipcRenderer.on('asynchronous-reply', (event, arg) => { // event not used
        console.log(arg); // "pong"
    });
});

input.addEventListener('change', (event) => {
    ipcRenderer.send('input-change', event.target.value);
});