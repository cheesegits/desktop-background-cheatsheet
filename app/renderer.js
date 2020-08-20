const { ipcRenderer } = require('electron');

const input = document.querySelector('.input-field');
const list = document.querySelector('#file-list');

let firstFile = '';

showFiles = (files) => {
    for (i = 0; i < files.length; i++) {
        const li = document.createElement('li');
        li.setAttribute('id', files[i]);
        li.appendChild(document.createTextNode(files[i]));
        list.appendChild(li);
    }
}

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
});
input.addEventListener('click', () => {
    if (input.value == '') {
        ipcRenderer.send('input-clicked');
    }
});

ipcRenderer.on('all-files', (_, allFiles) => {
    if (list.innerHTML == '') {
        showFiles(allFiles);
        input.setAttribute('placeholder', "Click input to hide files");
    } else {
        input.setAttribute('placeholder', "Click input to show files");
        list.innerHTML = '';
    }
});
ipcRenderer.on('files-match', (_, matchingFiles) => {
    firstFile = matchingFiles[0];
    list.innerHTML = '';
    showFiles(matchingFiles);
    if (input.value == '') {
        list.innerHTML = '';
    } else {
        // insert logic for mid-string highlighting, not just whole string
        document.getElementById(firstFile).style.backgroundColor = "lightblue";
    }
});
ipcRenderer.on('background-set', (_) => {
    document.getElementById('input-field').value = '';
    list.innerHTML = '';
});