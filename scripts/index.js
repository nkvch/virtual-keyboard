import { Keyboard } from './modules/keyboard.js';

var container = document.createElement('div');
container.className = 'container';
container.id = 'container';
const heading = document.createElement('div');
heading.className = 'heading';
heading.innerHTML = 
`<h1>ViRtual KeyBoard</h1>
<p>Keyboard is made using Linux(Ubuntu) system. To switch between languages: Ctrl + Alt</p>`;
container.appendChild(heading);
let textfield = document.createElement('textarea');
textfield.id = 'textfield';
textfield.className = 'textfield';
container.appendChild(textfield);
document.body.appendChild(container);

let board = new Keyboard();

board.generate();
