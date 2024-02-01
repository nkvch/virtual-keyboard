import { Keyboard } from './modules/keyboard.js';

var appContainer = document.createElement('div');
appContainer.className = 'app-container';
appContainer.id = 'appContainer';
const textContainer = document.createElement('div');
textContainer.className = 'text-container';

const heading = document.createElement('h1');
const headingText = document.createTextNode('ViRtual KeyBoard');
heading.appendChild(headingText);

const switchLangInfo = document.createElement('p');
const switchLangInfoText = document.createTextNode('Keyboard is made using Linux(Ubuntu) system. To switch between languages: Ctrl + Alt');
switchLangInfo.appendChild(switchLangInfoText);

textContainer.appendChild(heading);
textContainer.appendChild(switchLangInfo);


appContainer.appendChild(textContainer);
let textfield = document.createElement('textarea');
textfield.id = 'textfield';
textfield.className = 'textfield';
appContainer.appendChild(textfield);
document.body.appendChild(appContainer);

let board = new Keyboard();

board.generate();
