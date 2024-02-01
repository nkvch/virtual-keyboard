class KeyPrototype {
  constructor(name, row, keys, otherKeys) {
    this.name = name;
    this.languages = [keys, otherKeys];
    this.element = document.createElement('div');
    this.element.className = 'key';
    this.element.id = name;
    this.render();
    document.getElementById(`row${row}`).appendChild(this.element);
    this.textfield = document.getElementById('textfield');
    this.press = this.press.bind(this);
    this.unpress = this.unpress.bind(this);
  }

  render() {
    this.keys = this.languages[0];
    this.key = this.keys[0];
    if (this.name === 'Tab' || this.name === 'Enter') {
      this.element.innerHTML = `<h2>${
        this.name === 'Tab' ? 'Tab ↹' : 'Enter ↵'
      }</h2>`;
    } else {
      this.element.innerHTML = `<h2>${this.key}</h2>`;
    }
  }

  onCapslock() {
    if (/^[a-zA-Zа-яА-Я]$/.test(this.key)) {
      this.languages = this.languages.map((lang) => lang.reverse());
      this.render();
    }
  }

  Shift() {
    this.languages = this.languages.map((lang) => lang.reverse());
    this.render();
  }

  switchLang() {
    this.languages = this.languages.reverse();
    this.render();
  }

  press() {}

  unpress() {}
}

class Key extends KeyPrototype {
  constructor(name, row, keys, otherKeys) {
    super(name, row, keys, otherKeys);

    if (name === 'Enter' || name === 'Tab' || /Arrow/.test(name)) {
      this.element.className += ' control-key';
    }
    this.shifted = false;
    this.onCapslock = this.onCapslock.bind(this);
    this.Shift = this.Shift.bind(this);
  }

  press(e) {
    e.preventDefault();
    this.textfield.focus();
    if (!/pressed/.test(this.element.className)) {
      this.element.className += ' pressed';
    }
    const cursor = this.textfield.selectionStart;
    const selectionEnd = this.textfield.selectionEnd;
    this.textfield.value =
      this.textfield.value.slice(0, cursor) +
      this.key +
      this.textfield.value.slice(selectionEnd);
    this.textfield.setSelectionRange(cursor + 1, cursor + 1);
    return this.key;
  }

  unpress() {
    this.element.className = this.element.className.replace(/ pressed/g, '');
  }
}

class ControlKey extends KeyPrototype {
  constructor(name, row, keys, fnc1, fnc2) {
    super(name, row, keys, keys);
    this.element.className += ' control-key';
    this.onCapslock = this.onCapslock.bind(this);

    this.press = (event) => {
      event.preventDefault();
      this.element.className += ' pressed';
      if (fnc1) {
        fnc1(event);
      }
    };
    this.unpress = (event) => {
      if (fnc2) {
        fnc2(event);
      }
      this.element.className = this.element.className.replace(/ pressed/g, '');
    };
  }

  onCapslock() {}

  Shift() {}
}

export { Key, ControlKey };
