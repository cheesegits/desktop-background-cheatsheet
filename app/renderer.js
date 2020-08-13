const { ipcRenderer } = require('electron');

const input = document.querySelector('.input-field');
const list = document.querySelector('#file-list');

let firstFile = '';

input.addEventListener('keyup', (event) => {
    const text = document.getElementById('input-field').value;
    console.log(text);

    switch (event.key) {
        case 'Enter':
            ipcRenderer.send('input-change', text);
            break;
        case 'Tab':
            document.getElementById('input-field').value = firstFile;
            break;
        case 'Control':
        case 'Shift':
        case 'Alt':
            event.preventDefault();
            break;
        default:
            ipcRenderer.send('key-press', text); // shift-symbol keystrokes like "(" trigger an error? - "switch statement evaluates only character or integer value." https://techdifferences.com/difference-between-if-else-and-switch.html
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
        document.getElementById(firstFile).style.backgroundColor = "lightblue";
    });
    ipcRenderer.on('background-set', (_) => {
        document.getElementById('input-field').value = '';
        list.innerHTML = '';
    });
});