import { Key, ControlKey } from './key.js';

class Keyboard {
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'keyboard';
    this.element.id = 'keyboard';
    this.rows = Array(5)
      .fill(0)
      .map(function (el, idx) {
        let row = document.createElement('div');
        row.className = 'row';
        row.id = `row${idx + 1}`;
        return row;
      });
    this.keys = [
      'Backquote',
      'Digit1',
      'Digit2',
      'Digit3',
      'Digit4',
      'Digit5',
      'Digit6',
      'Digit7',
      'Digit8',
      'Digit9',
      'Digit0',
      'Minus',
      'Equal',
      'Backspace',
      'Tab',
      'KeyQ',
      'KeyW',
      'KeyE',
      'KeyR',
      'KeyT',
      'KeyY',
      'KeyU',
      'KeyI',
      'KeyO',
      'KeyP',
      'BracketLeft',
      'BracketRight',
      'Backslash',
      'CapsLock',
      'KeyA',
      'KeyS',
      'KeyD',
      'KeyF',
      'KeyG',
      'KeyH',
      'KeyJ',
      'KeyK',
      'KeyL',
      'Semicolon',
      'Quote',
      'Enter',
      'ShiftLeft',
      'KeyZ',
      'KeyX',
      'KeyC',
      'KeyV',
      'KeyB',
      'KeyN',
      'KeyM',
      'Comma',
      'Period',
      'Slash',
      'ArrowUp',
      'ShiftRight',
      'ControlLeft',
      'win',
      'AltLeft',
      'Space',
      'AltRight',
      'ArrowLeft',
      'ArrowDown',
      'ArrowRight',
      'ControlRight',
    ];
    this.pressed = [];
    this.shifted = [false, false];
    this.controled = [false, false];
    this.mouseClicked = null;
    this.generate = this.generate.bind(this);
    this.rows.forEach((row) => this.element.appendChild(row));
    document.getElementById('container').appendChild(this.element);
    this.textfield = document.getElementById('textfield');
    this.textfield.addEventListener('focusout', (e) => {
      e.preventDefault();
    });
    this.generate = this.generate.bind(this);
    this.onCapslock = this.onCapslock.bind(this);
    this.onShift = this.onShift.bind(this);
    this.offShift = this.offShift.bind(this);
    this.onBackspace = this.onBackspace.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.onAlt = this.onAlt.bind(this);
    this.onCtrl = this.onCtrl.bind(this);
    this.offCtrl = this.offCtrl.bind(this);
    if (localStorage.getItem('language')) {
      this.language = localStorage.getItem('language');
    } else {
      this.language = 'eng';
      localStorage.setItem('language', this.language);
    }
    window.addEventListener('keydown', (event) => {
      event.preventDefault();
      const key = event.code;
      this.pressed.push(key);
      if (key !== this.mouseClicked) {
        this[key].press(event);
      }
    });

    window.addEventListener('keyup', (event) => {
      event.preventDefault();
      const key = event.code;
      this.pressed = this.pressed.filter((el) => el !== key);
      if (key !== this.mouseClicked) {
        this[key].unpress(event);
      }
    });

    this.element.addEventListener('mousedown', (event) => {
      //console.log(event);
      event.preventDefault();
      const key = event.path.find((el) =>
        /(^key$|control-key)/.test(el.className)
      )?.id;
      if (key) {
        this.mouseClicked = key;
        if (!this.pressed.includes(key)) {
          this[key].press(event);
        }
      }
    });

    this.element.addEventListener('mouseup', (event) => {
      event.preventDefault();
      if (this.mouseClicked) {
        const key = this.mouseClicked;
        this.mouseClicked = null;
        if (!this.pressed.includes(key)) {
          this[key].unpress(event);
        }
      }
    });
  }

  onBackspace() {
    const cursor = this.textfield.selectionStart;
    const selectionEnd = this.textfield.selectionEnd;
    if (selectionEnd > 0) {
      this.textfield.value =
        cursor === selectionEnd
          ? this.textfield.value.slice(0, cursor - 1) +
            this.textfield.value.slice(cursor)
          : this.textfield.value.slice(0, cursor) +
            this.textfield.value.slice(selectionEnd);
      if (cursor === selectionEnd) {
        this.textfield.setSelectionRange(cursor - 1, cursor - 1);
      } else {
        this.textfield.setSelectionRange(cursor, cursor);
      }
    }
  }

  onCapslock() {
    for (let key of this.keys) {
      this[key].onCapslock();
    }
  }

  onShift() {
    this.shifted[0] = true;
    this.shifted = this.shifted.reverse();
    if (this.shifted[0] !== this.shifted[1]) {
      for (let key of this.keys) {
        this[key].Shift();
      }
    }
  }

  offShift() {
    this.shifted[1] = false;
    this.shifted = this.shifted.reverse();
    if (!(this.shifted[0] || this.shifted[1])) {
      for (let key of this.keys) {
        this[key].Shift();
      }
    }
  }

  moveLeft() {
    const cursor = this.textfield.selectionStart;
    const selectionEnd = this.textfield.selectionEnd;
    if (cursor > 0) {
      if (this.shifted[0] || this.shifted[1]) {
        this.textfield.setSelectionRange(cursor - 1, selectionEnd);
      } else {
        this.textfield.setSelectionRange(cursor - 1, cursor - 1);
      }
    }
  }

  moveRight() {
    const cursor = this.textfield.selectionStart;
    const selectionEnd = this.textfield.selectionEnd;
    if (selectionEnd < this.textfield.value.length) {
      if (this.shifted[0] || this.shifted[1]) {
        this.textfield.setSelectionRange(cursor, selectionEnd + 1);
      } else {
        this.textfield.setSelectionRange(selectionEnd + 1, selectionEnd + 1);
      }
    }
  }

  switchLang() {
    if (this.language === 'eng') {
      this.language = 'ru';
      localStorage.setItem('language', this.language);
    } else {
      this.language = 'eng';
      localStorage.setItem('language', this.language);
    }
    for (let key of this.keys) {
      this[key].switchLang();
    }
  }

  onCtrl() {
    this.controled[0] = true;
    this.controled = this.controled.reverse();
  }

  offCtrl() {
    this.controled[1] = false;
    this.controled = this.controled.reverse();
  }

  onAlt() {
    if (this.controled[0] || this.controled[1]) {
      this.switchLang();
    }
  }

  generate() {
    this.Backquote = new Key('Backquote', 1, ['`', '~'], ['ё', 'Ё']);
    this.Digit1 = new Key('Digit1', 1, ['1', '!'], ['1', '!']);
    this.Digit2 = new Key('Digit2', 1, ['2', '@'], ['2', '"']);
    this.Digit3 = new Key('Digit3', 1, ['3', '#'], ['3', '№']);
    this.Digit4 = new Key('Digit4', 1, ['4', '$'], ['4', ';']);
    this.Digit5 = new Key('Digit5', 1, ['5', '%'], ['5', '%']);
    this.Digit6 = new Key('Digit6', 1, ['6', '^'], ['6', ':']);
    this.Digit7 = new Key('Digit7', 1, ['7', '&'], ['7', '?']);
    this.Digit8 = new Key('Digit8', 1, ['8', '*'], ['8', '*']);
    this.Digit9 = new Key('Digit9', 1, ['9', '('], ['9', '(']);
    this.Digit0 = new Key('Digit0', 1, ['0', ')'], ['0', ')']);
    this.Minus = new Key('Minus', 1, ['-', '_'], ['-', '_']);
    this.Equal = new Key('Equal', 1, ['=', '+'], ['=', '+']);
    this.Backspace = new ControlKey(
      'Backspace',
      1,
      ['Backspace'],
      this.onBackspace
    );
    this.Tab = new Key('Tab', 2, ['\t'], ['\t']);
    this.KeyQ = new Key('KeyQ', 2, ['q', 'Q'], ['й', 'Й']);
    this.KeyW = new Key('KeyW', 2, ['w', 'W'], ['ц', 'Ц']);
    this.KeyE = new Key('KeyE', 2, ['e', 'E'], ['у', 'У']);
    this.KeyR = new Key('KeyR', 2, ['r', 'R'], ['к', 'К']);
    this.KeyT = new Key('KeyT', 2, ['t', 'T'], ['е', 'Е']);
    this.KeyY = new Key('KeyY', 2, ['y', 'Y'], ['н', 'Н']);
    this.KeyU = new Key('KeyU', 2, ['u', 'U'], ['г', 'Г']);
    this.KeyI = new Key('KeyI', 2, ['i', 'I'], ['ш', 'Ш']);
    this.KeyO = new Key('KeyO', 2, ['o', 'O'], ['щ', 'Щ']);
    this.KeyP = new Key('KeyP', 2, ['p', 'P'], ['з', 'З']);
    this.BracketLeft = new Key('BracketLeft', 2, ['[', '{'], ['х', 'Х']);
    this.BracketRight = new Key('BracketRight', 2, [']', '}'], ['ъ', 'Ъ']);
    this.Backslash = new Key('Backslash', 2, ['\\', '|'], ['\\', '/']);
    this.CapsLock = new ControlKey(
      'CapsLock',
      3,
      ['CapsLock'],
      this.onCapslock
    );
    this.KeyA = new Key('KeyA', 3, ['a', 'A'], ['ф', 'Ф']);
    this.KeyS = new Key('KeyS', 3, ['s', 'S'], ['ы', 'Ы']);
    this.KeyD = new Key('KeyD', 3, ['d', 'D'], ['в', 'В']);
    this.KeyF = new Key('KeyF', 3, ['f', 'F'], ['а', 'А']);
    this.KeyG = new Key('KeyG', 3, ['g', 'G'], ['п', 'П']);
    this.KeyH = new Key('KeyH', 3, ['h', 'H'], ['р', 'Р']);
    this.KeyJ = new Key('KeyJ', 3, ['j', 'J'], ['о', 'О']);
    this.KeyK = new Key('KeyK', 3, ['k', 'K'], ['л', 'Л']);
    this.KeyL = new Key('KeyL', 3, ['l', 'L'], ['д', 'Д']);
    this.Semicolon = new Key('Semicolon', 3, [';', ':'], ['ж', 'Ж']);
    /* eslint quotes: 0 */
    this.Quote = new Key('Quote', 3, ["'", '"'], ['э', 'Э']);
    this.Enter = new Key('Enter', 3, ['\n'], ['\n']);
    this.ShiftLeft = new ControlKey(
      'ShiftLeft',
      4,
      ['Shift'],
      this.onShift,
      this.offShift
    );
    this.KeyZ = new Key('KeyZ', 4, ['z', 'Z'], ['я', 'Я']);
    this.KeyX = new Key('KeyX', 4, ['x', 'X'], ['ч', 'Ч']);
    this.KeyC = new Key('KeyC', 4, ['c', 'C'], ['с', 'С']);
    this.KeyV = new Key('KeyV', 4, ['v', 'V'], ['м', 'М']);
    this.KeyB = new Key('KeyB', 4, ['b', 'B'], ['и', 'И']);
    this.KeyN = new Key('KeyN', 4, ['n', 'N'], ['т', 'Т']);
    this.KeyM = new Key('KeyM', 4, ['m', 'M'], ['ь', 'Ь']);
    this.Comma = new Key('Comma', 4, [',', '<'], ['б', 'Б']);
    this.Period = new Key('Period', 4, ['.', '>'], ['ю', 'Ю']);
    this.Slash = new Key('Slash', 4, ['/', '?'], ['.', ',']);
    this.ArrowUp = new Key('ArrowUp', 4, ['⬆'], ['⬆']);
    this.ShiftRight = new ControlKey(
      'ShiftRight',
      4,
      ['Shift'],
      this.onShift,
      this.offShift
    );
    this.ControlLeft = new ControlKey(
      'ControlLeft',
      5,
      ['Ctrl'],
      this.onCtrl,
      this.offCtrl
    );
    this.win = new ControlKey('win', 5, ['win']);
    this.AltLeft = new ControlKey('AltLeft', 5, ['Alt'], this.onAlt);
    this.Space = new Key('Space', 5, [' '], [' ']);
    this.AltRight = new ControlKey('AltRight', 5, ['Alt'], this.onAlt);
    this.ArrowLeft = new ControlKey('ArrowLeft', 5, ['⬅'], this.moveLeft);
    this.ArrowDown = new Key('ArrowDown', 5, ['⬇'], ['⬇']);
    this.ArrowRight = new ControlKey('ArrowRight', 5, ['⮕'], this.moveRight);
    this.ControlRight = new ControlKey(
      'ControlRight',
      5,
      ['Ctrl'],
      this.onCtrl,
      this.offCtrl
    );
    if (this.language === 'ru') {
      for (let key of this.keys) {
        this[key].switchLang();
      }
    }
  }
}

export { Keyboard };
