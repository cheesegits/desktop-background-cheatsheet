const { ipcRenderer } = require('electron');

const input = document.querySelector('.input-field');
const list = document.querySelector('#file-list');

let firstFile = '';
let inputValue = '';
// let currentFiles = [];

showFiles = (files) => {
    for (i = 0; i < files.length; i++) {
        const li = document.createElement('li');
        const index = files[i].indexOf(inputValue);
        li.setAttribute('id', files[i]);
        list.appendChild(li);
        document.getElementById(files[i]).innerHTML = `${files[i].substring(0, index)}<span class="highlight">${files[i].substring(index, index + inputValue.length)}</span>${files[i].substring(index+inputValue.length, files[i].length)}`;
    }
    if (inputValue == '') {
        list.style.backgroundColor = "#1b2d42";
    } else {
        document.getElementById(firstFile).style.backgroundColor = "#2d421b";
    }
};

input.addEventListener('keyup', (event) => {

    inputValue = input.value; // double check/rework inputValue/input.value below

    highlightLi = (arrowKey) => {

        const listFiles = list.getElementsByTagName('li');
        let increment = 0;
        let newIndex = 0;
        let highlightedIndex = undefined;

        if (arrowKey == 'ArrowDown') {
            increment++;
        } else {
            increment--;
        }


        for (var i = 0; i < listFiles.length; i++) {
            if (listFiles[i].hasAttribute('style')) {
                highlightedIndex = i;
                document.getElementById(listFiles[i].id).removeAttribute('style');
                break;
            } else {
                highlightedIndex = undefined;
            }
        }

        // convert into switch, or if/else for seperate logic ok?
        if (increment == 1 && highlightedIndex == undefined) { // when down is pushed and nothing is highlighted
            newIndex = 0;
        } else if (increment == -1 && highlightedIndex == undefined) { // when up is pushed and nothing is highlighted
            newIndex = listFiles.length - 1;
        } else if (increment == -1 && highlightedIndex == 0) { // when up is pushed and the top line is highlighted
            newIndex = listFiles.length - 1;
        } else if (increment == 1 && highlightedIndex == listFiles.length - 1) { // when down is pushed and the bottom line is highlighted
            newIndex = 0;
        } else {
            newIndex = highlightedIndex + increment; //, else move up or down through the rest of the list
        }

        document.getElementById(listFiles[newIndex].id).style.backgroundColor = "#2d421b";
    };

    switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
            highlightLi(event.key);
            break;
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
                // currentFiles = '';
            } else {
                ipcRenderer.send('key-press', inputValue);
            }
            break;
        case 'Control':
        case 'Shift':
        case 'Alt':
            event.preventDefault();
            break;
        default:
            ipcRenderer.send('key-press', input.value); // issue: shift-symbol keystrokes like "(" trigger an error
            inputValue = input.value;
    }
});

input.addEventListener('click', () => {
    if (input.value == '') {
        ipcRenderer.send('input-clicked');
    }
});

list.addEventListener('click', (event) => {
    ipcRenderer.send('input-change', event.target.id);
});

ipcRenderer.on('all-files', (_, allFiles) => {
    // currentFiles = allFiles;
    if (list.innerHTML == '') {
        showFiles(allFiles);
        input.setAttribute('placeholder', "Click input to hide files");
    } else {
        input.setAttribute('placeholder', "Click input to show files");
        list.innerHTML = '';
    }
});
ipcRenderer.on('files-match', (_, matchingFiles) => {
    // currentFiles = matchingFiles;
    firstFile = matchingFiles[0];
    input.value = inputValue;
    list.innerHTML = '';
    showFiles(matchingFiles);
    if (input.value == '') {
        list.innerHTML = '';
    }
});
ipcRenderer.on('background-set', (_) => {
    document.getElementById('input-field').value = '';
    list.innerHTML = '';
});