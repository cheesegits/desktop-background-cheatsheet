const { ipcRenderer } = require('electron');

const input = document.querySelector('.input-field');
const list = document.querySelector('#file-list');

input.addEventListener('keypress', (event) => {
    let text = document.getElementById('input-field').value;

    if (event.key === 'Enter') {
        ipcRenderer.send('input-change', event.target.value);
    } else {
        text += event.key;
        ipcRenderer.send('key-press', text);
    }

    ipcRenderer.on('files-match', (event, files) => {
        list.innerHTML = '';
        for (i = 0; i < files.length; i++) {
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(files[i]));
            list.appendChild(li);
        }
    });
    ipcRenderer.on('background-set', (event) => {
        document.getElementById('input-field').value = '';
        list.innerHTML = '';
    });
});