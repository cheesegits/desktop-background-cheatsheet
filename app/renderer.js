const { ipcRenderer } = require('electron');

const openFileButton = document.querySelector('#open-file');

openFileButton.addEventListener('click', () => {
    // console.log(arg); // prints "pingy"
    // event.returnValue = 'pongy';
    ipcRenderer.send('asynchronous-message', 'ping');
    // console.log('cool');
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log(arg); // prints "pong"
    });
});

// // Synchronous example only
// console.log(ipcRenderer.sendSync('synchronous-message', 'pingy')); // prints "pongy"

// // //

// const marked = require('marked');

// const markdownView = document.querySelector('#markdown');
// const htmlView = document.querySelector('#html');

// const renderMarkdownToHtml = markdown => {
//     htmlView.innerHTML = marked(markdown, { sanitize: true });
// };

// markdownView.addEventListener('keyup', event => {
//     const currentContent = event.target.value;
//     renderMarkdownToHtml(currentContent);
// });
// };