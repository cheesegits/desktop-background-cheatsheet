const { ipcRenderer } = require('electron');

const input = document.querySelector('.input-field');
const list = document.querySelector('#file-list');

input.addEventListener('keypress', (event) => {
    let text = document.getElementById('input-field').value;
    if (event.key === 'Enter') {
        console.log('enter was pressed');
    } else {
        text += event.key;
    }
    ipcRenderer.send('key-press', text); // doesn't re render when deleting characters, need another event listener
    ipcRenderer.on('files-match', (event, files) => {
        console.log(files);
        list.innerHTML = '';
        for (i = 0; i < files.length; i++) {
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(files[i]));
            list.appendChild(li);
        }
    });
});

// input.addEventListener('change', (event) => {
//     ipcRenderer.send('input-change', event.target.value);
//     ipcRenderer.on('background-set', (event, files) => {
//         console.log(files);
//         for (i = 0; i < files.length; i++) {
//             const li = document.createElement('li');
//             li.appendChild(document.createTextNode(files[i]));
//             list.appendChild(li);
//         }
//     });
// });