const { ipcRenderer } = require('electron');

const input = document.querySelector('.input-field');
const list = document.querySelector('#file-list');


input.addEventListener('change', (event) => {
    ipcRenderer.send('input-change', event.target.value);
    ipcRenderer.on('background-set', (event, files) => {
        for (i = 0; i < files.length; i++) {
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(files[i]));
            list.appendChild(li);
        }
    });
});