const { ipcRenderer } = require('electron');

const openFileButton = document.querySelector('#open-file');
const input = document.querySelector('.input-field');
const list = document.querySelector('#file-list');

openFileButton.addEventListener('click', () => {
    ipcRenderer.send('asynchronous-message', 'ping');
    ipcRenderer.on('asynchronous-reply', (event, arg) => { // event not used
        console.log(arg); // "pong"
    });
});

input.addEventListener('change', (event) => {
    ipcRenderer.send('input-change', event.target.value);
    ipcRenderer.on('background-set', (event, files) => {
        console.log(files);
        for (i = 0; i < files.length; i++) {
            const node = document.createElement('li'); // devTool element tab doesn't show li under ul, but does visually display files[i] in browser // https://www.w3schools.com/jsref/met_node_appendchild.asp
            const fileName = document.createTextNode(`${files[i]}`);
            const listItem = node.appendChild(fileName);
            list.appendChild(listItem);
        }
    });
});