const { ipcRenderer } = require('electron');

const input = document.querySelector('.input-field');
const list = document.querySelector('#file-list');

input.addEventListener('keyup', (event) => {
    const text = document.getElementById('input-field').value;
    console.log(text);

    switch (event.key) {
        case 'Enter':
            ipcRenderer.send('input-change', text);
            break;
        case 'Tab': // logic to autocomplete file name
        case 'Control':
        case 'Shift':
        case 'Alt':
            event.preventDefault();
            break;
        default:
            ipcRenderer.send('key-press', text); // symbols like () trigger an error
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