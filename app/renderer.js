/** ISSUES/BUGS
 * 1) css:hover and highlightingTabCompletion() highlighting are not linked
 * 2) css:hover and up/down arrow highlighting are not not linked
   // could link with addEventListener('onmouseover', function);

 * 3) not correctly highlighting when capital letters are in the substring
   // convert to lowercase for comparison to match, but need better understanding of capital letter sensitivity

 * 4) $items is always returning a NodeList with length 0
 * 4.1) ArrowDown doesn't cycle back to the top at the end of the list because "$items.length - 1" is never true;
        // could bypass $items altogether by cycling through state.currentFiles and adding class="highlight" by id
    // poor understanding of document load vs. functions that append and when/where I can effectively querySelector, when to use selectors and NodeList vs. when to cycle through state

 * 5) consider reworking state.selected into state.highlighted
 * 6) TypeError on 'aa' null - should not make it to that line of code when inputValue contains text, but subString fails to match anything in currentFiles
 * 7) issue: shift-symbol keystrokes like "(" trigger an error
 * 8) could save a line by setting state inside showFiles, but setting state on receival feels clean
 * 9) else doesn't cover all cases like left/right arrow
 */

const { ipcRenderer } = require('electron');

const $input = document.querySelector('input');
const $list = document.querySelector('ul');
// const $items = document.querySelectorAll('ul li'); // 4)

const state = {
    selected: null, // 5)
    highlighted: null,
    inputValue: '',
    currentFiles: []
};

const highlightTabCompletion = (state) => {
    if (state.inputValue == '') {
        state.highlighted = null;
    } else { // 6)
        state.highlighted = state.currentFiles[0];
        state.selected = 0;
        document.getElementById(state.highlighted).setAttribute('class', 'highlight'); // 1)
    }
};

const highlightSubstring = (file, state) => {
    let index = file.indexOf(state.inputValue); // 3)
    document.getElementById(file).innerHTML = `${file.substring(0, index)}<span class="highlight">${file.substring(index, index + state.inputValue.length)}</span>${file.substring(index+state.inputValue.length, file.length)}`;
};

const highlightNewItem = (state) => {
    if (state.highlighted !== null) {
        document.getElementById(state.highlighted).removeAttribute('class');
    }
    for (var i = 0; i < state.currentFiles.length; i++) {
        if (i === state.selected) {
            state.highlighted = state.currentFiles[i];
            // $items[i].setAttribute('class', 'highlight'); // 4)
            document.getElementById(state.highlighted).setAttribute('class', 'highlight'); // 1)
        }
    }
};

const showFiles = (files) => {
    $list.innerHTML = '';
    for (i = 0; i < files.length; i++) {
        const file = files[i];
        const li = document.createElement('li');
        li.setAttribute('id', file);
        $list.appendChild(li);
        if (state.inputValue === '') {
            document.getElementById(file).innerHTML = file;
        } else {
            highlightSubstring(file, state);
        }
    }
    highlightTabCompletion(state);
};

const keyUp = (key, state) => {
    switch (key) {
        case 'Tab':
            state.inputValue = state.currentFiles[state.selected];
            ipcRenderer.send('key-press', state.inputValue);
            $input.value = state.inputValue;
            break;
        case 'Enter':
            ipcRenderer.send('input-change', state.highlighted);
            console.log('after ipc.send, before ipc.on', state);
            break;
        case 'ArrowDown':
            if (state.selected === null || state.selected === state.currentFiles.length - 1) { // 4.1)
                state.selected = 0;
            } else {
                state.selected += 1;
            }
            highlightNewItem(state);
            break;
        case 'ArrowUp':
            if (state.selected === null || state.selected === 0) {
                state.selected = state.currentFiles.length - 1;
                highlightNewItem(state);
            } else {
                state.selected -= 1;
                highlightNewItem(state);
            }
            break;
        case 'Backspace':
            if (state.inputValue == '') {
                $input.setAttribute('placeholder', "Click input to show files"); // has noticeable delay when ipcRenderer.on('all-files') was activated before typing into input
                $list.innerHTML = '';
                state.currentFiles = [];
                state.selected = null;
            } else {
                ipcRenderer.send('key-press', state.inputValue);
            }
            break;
        case 'Control':
        case 'Shift':
        case 'Alt':
            event.preventDefault();
            break;
        default:
            state.selected = 0;
            ipcRenderer.send('key-press', state.inputValue); // 7)
    }
};

$input.addEventListener('keyup', (event) => {
    state.inputValue = $input.value;
    keyUp(event.key, state);
});

$input.addEventListener('click', _ => {
    if ($input.value == '') {
        ipcRenderer.send('input-clicked');
    }
});

// $list.addEventListener('mouseover', (event, state) => {
//     console.log(event.target.id);
//     state.highlighted = event.target.id;
//     state.selected = event.target.id;
//     // if mouseover true, remove highlighting from li

//     // when mouseover false, restore highlighting to match state.inputValue;
//     console.log('mouseover');
// });

// $list.addEventListener('mouseleave', event => {
//     state.selected = 0;
//     highlightNewItem(state);
// });

$list.addEventListener('click', event => {
    ipcRenderer.send('input-change', event.target.id);
});

ipcRenderer.on('all-files', (_, allFiles) => {
    console.log(state);
    state.selected = null;
    state.highlighted = null;
    state.currentFiles = allFiles; // 8)
    if ($list.innerHTML === '') {
        showFiles(state.currentFiles);
        $input.setAttribute('placeholder', "Click input to hide files");
    } else {
        $input.setAttribute('placeholder', "Click input to show files"); // 9) else doesn't cover all cases like left/right arrow 
        $list.innerHTML = '';
    }
});
ipcRenderer.on('files-match', (_, matchingFiles) => {
    state.currentFiles = matchingFiles; // 8)
    showFiles(state.currentFiles);
    if ($input.value == '') {
        $list.innerHTML = '';
    }
});
ipcRenderer.on('background-set', (_) => {
    console.log('ipcRenderer.on("background-set")', state);
    $list.innerHTML = '';
    state.selected = null;
    state.highlighted = null;
    state.currentFiles = [];
    state.inputValue = '';
    document.getElementById('input').value = state.inputValue;
    console.log(state);
});

console.log('starting state?: ', state);