const { ipcRenderer } = require('electron');

const input = document.querySelector('.input-field');
const list = document.querySelector('#file-list');

let firstFile = '';

input.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'Enter':
            ipcRenderer.send('input-change', input.value);
            break;
        case 'Tab':
            if (input.value == '') {} else {
                input.value = firstFile;
            }
            break;
        case 'Backspace':
            if (input.value == '') {
                list.innerHTML = '';
            } else {
                ipcRenderer.send('key-press', input.value);
            }
            break;
        case 'Control':
        case 'Shift':
        case 'Alt':
            event.preventDefault();
            break;
        default:
            ipcRenderer.send('key-press', input.value); // shift-symbol keystrokes like "(" trigger an error
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
        if (input.value == '') {
            list.innerHTML = '';
        } else {
            document.getElementById(firstFile).style.backgroundColor = "lightblue";
        }
    });
    ipcRenderer.on('background-set', (_) => {
        document.getElementById('input-field').value = '';
        list.innerHTML = '';
    });
});