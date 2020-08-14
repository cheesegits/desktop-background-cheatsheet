const { ipcRenderer } = require('electron');

const input = document.querySelector('.input-field');
const list = document.querySelector('#file-list');

let firstFile = '';

input.addEventListener('keyup', (event) => {
    const text = document.getElementById('input-field').value;

    switch (event.key) {
        case 'Enter':
            ipcRenderer.send('input-change', text);
            break;
        case 'Tab':
            // when input is '', Tab auto-completes first item in array, even though first li is not highlighted
            document.getElementById('input-field').value = firstFile;
            break;
        case 'Control':
        case 'Shift':
        case 'Alt':
            event.preventDefault();
            break;
        default:
            ipcRenderer.send('key-press', text); // shift-symbol keystrokes like "(" trigger an error
    }

    ipcRenderer.on('files-match', (_, files) => {
        firstFile = files[0];
        list.innerHTML = '';
        for (i = 0; i < files.length; i++) {
            const li = document.createElement('li');
            li.setAttribute('id', files[i]);
            li.appendChild(document.createTextNode(files[i]));
            list.appendChild(li);
        }
        if (text == '') {
            document.getElementById(firstFile).style.backgroundColor = "#2e2c29";
        } else {
            document.getElementById(firstFile).style.backgroundColor = "lightblue";
        } // errors out at this line whenever Capital letter
    });
    ipcRenderer.on('background-set', (_) => {
        document.getElementById('input-field').value = '';
        list.innerHTML = '';
    });
});