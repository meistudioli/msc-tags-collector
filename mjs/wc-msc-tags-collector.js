import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';
import {
  colorPalette as _fujiColorPalette,
  a11y as _fujiA11y
} from './fuji-css.js';
import Mustache from './mustache.js';

const defaults = {
  illegalkeys: [],
  placeholder: [],
  l10n: {
    placeholder: 'tag'
  },
  limitation: {
    maxcount: 10,
    maxlength: 30
  }
};

const booleanAttrs = []; // booleanAttrs default should be false
const objectAttrs = ['limitation', 'placeholder', 'l10n'];
const custumEvents = {
  input: 'msc-tags-collector-input',
  mutate: 'msc-tags-collector-mutate',
  error: 'msc-tags-collector-error'
};
const { down:evtDown, move:evtMove, up:evtUp } = _wcl.pursuer();
const legalKey = [
  'ArrowLeft',
  'ArrowRight',
  'Backspace',
  'Escape'
];

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}
${_fujiColorPalette}
${_fujiA11y}

:host{position:relative;display:block;}

.main {
  /* main */
  --main-padding: var(--msc-tags-collector-padding, 12px);
  --main-gap: var(--msc-tags-collector-gap, 12px);

  --unit-size: 2em;
  --padding-inline: .75em;
  --decoy-scale: 1;

  --mask-icon-remove: path('M6.82,14.08l2.94-2.94l2.94,2.94l1.06-1.06l-2.94-2.94l2.94-2.94L12.7,6.08L9.76,9.01L6.82,6.08L5.76,7.14l2.94,2.94 l-2.94,2.94L6.82,14.08z M9.76,18.08c-1.1,0-2.13-0.21-3.1-0.62s-1.82-0.99-2.55-1.72C3.37,15,2.8,14.15,2.38,13.18 s-0.63-2.01-0.63-3.1c0-1.11,0.21-2.15,0.63-3.11S3.37,5.15,4.1,4.42s1.58-1.3,2.55-1.72s2.01-0.62,3.1-0.62 c1.11,0,2.15,0.21,3.11,0.62s1.81,0.99,2.54,1.72c0.73,0.73,1.3,1.58,1.72,2.54s0.62,2,0.62,3.11c0,1.1-0.21,2.13-0.62,3.1 s-0.99,1.82-1.72,2.55c-0.73,0.73-1.58,1.3-2.54,1.72S10.87,18.08,9.76,18.08z M9.76,16.58c1.81,0,3.34-0.63,4.6-1.9 s1.9-2.8,1.9-4.6s-0.63-3.34-1.9-4.6s-2.8-1.9-4.6-1.9s-3.34,0.63-4.6,1.9s-1.9,2.8-1.9,4.6s0.63,3.34,1.9,4.6 S7.95,16.58,9.76,16.58z');

  /* input */
  --input-color: var(--msc-tags-collector-input-color, rgba(35 42 49));
  --input-placeholder-color: var(--msc-tags-collector-input-placeholder-color, rgba(151 158 168));
  --caret-color: var(--msc-tags-collector-caret-color, rgba(35 42 49)); 
}

.tags-collector__unit {
  --unit-color: var(--msc-tags-collector-tag-color, rgba(70, 78, 86));
  --unit-background-color: var(--msc-tags-collector-tag-background-color, rgba(224 228 233));
  --unit-border-color: var(--msc-tags-collector-tag-focus-border-color, rgba(101 160 249));

  --remove-sign-color: var(--msc-tags-collector-tag-remove-color, rgba(91 99 106));
  --remove-sign-size: 1.25em;
  --remove-opacity-normal: .5;
  --remove-opacity-active: 1;
  --remove-opacity: var(--remove-opacity-normal);

  --border-opacity-normal: 0;
  --border-opacity-active: 1;
  --border-opacity: var(--border-opacity-normal);

  --unit-indicator-pointer-events: auto;

  /* show & dismiss */
  --scale-normal: scale(.001);
  --scale-active: scale(1);
  --scale: var(--scale-normal);
}

.tags-collector__unit:focus-within {
  --border-opacity: var(--border-opacity-active);
}

.tags-collector{position:relative;display:flex;padding:var(--main-padding);flex-wrap:wrap;gap:var(--main-gap);align-items:center;outline:0 none;}
.tags-collector__input{inline-size:7.5em;color:var(--input-color);caret-color:var(--caret-color);line-height:var(--unit-size);padding-inline:var(--padding-inline);background-color:transparent;border:0 none;border-radius:0;outline:0 none;appearance:none;display:block;box-sizing:border-box;}
.tags-collector__input::placeholder{color:var(--input-placeholder-color);}
.tags-collector__unit{position:relative;color:var(--unit-color);background-color:var(--unit-background-color);inline-size:fit-content;block-size:var(--unit-size);border-radius:var(--unit-size);padding-inline-start:.875em;display:flex;align-items:center;overflow:hidden;outline:0 none;cursor:move;pointer-events:var(--unit-indicator-pointer-events);white-space:nowrap;}
.tags-collector__unit::before{position:absolute;inset-inline-start:0;inset-block-start:0;content:'';inline-size:100%;block-size:100%;box-sizing:border-box;border:2px dashed var(--unit-border-color);border-radius:var(--unit-size);pointer-events:none;will-change:opacity;transition:opacity 100ms ease;opacity:var(--border-opacity);}
.tags-collector__unit__remove{position:relative;inline-size:var(--unit-size);block-size:var(--unit-size);transition:opacity 100ms ease;will-change:opacity;opacity:var(--remove-opacity);outline:0 none;}
.tags-collector__unit__remove{appearance:none;border-radius:0;border:0 none;background:transparent;color:transparent;padding:0;margin:0;box-sizing:border-box;}
.tags-collector__unit__remove::before{position:absolute;inset-inline:0;inset-block:0;margin:auto;content:'';inline-size:var(--remove-sign-size);aspect-ratio:1/1;background-color:var(--remove-sign-color);border-radius:var(--remove-sign-size);box-sizing:border-box;clip-path:var(--mask-icon-remove);}
.tags-collector__unit__remove:focus {
  --remove-opacity: var(--remove-opacity-active);
}

.tags-collector__unit{transition:transform 150ms cubic-bezier(.02,.39,.59,1.4);transform:var(--scale);}
.tags-collector__unit--ready {
  --scale: var(--scale-active);
}
.tags-collector__unit--dismiss {
  --scale: var(--scale-normal);
}

/* decoy */
.tags-collector__unit__decoy {
  --x: 0px;
  --y: 0px;
}
.tags-collector__unit__decoy{position:fixed;inset-inline-start:var(--x);inset-block-start:var(--y);opacity:.5;display:none;z-index:2147483647;transform:scale(var(--decoy-scale));pointer-events:none;}
.tags-collector__unit__decoy--show{display:flex;}
.tags-collector__unit__decoy--mutate-axis{}

/* drag */
[data-status='drag'] {
  --unit-color: transparent;
  --unit-background-color: transparent;
  --remove-opacity: 0;
  --border-opacity: var(--border-opacity-active);
  --unit-indicator-pointer-events: none;
  --a11y-block-link-opacity-active: 0;
}

@media (hover: hover) {
  .tags-collector__unit__remove:hover {
    --remove-opacity: var(--remove-opacity-active);
  }
}

@media (hover: none) {
  .tags-collector__unit__remove:hover {
    --remove-opacity: var(--remove-opacity-active);
  }
}
</style>

<div class="main" ontouchstart="">
  <form class="tags-collector" tabindex="0">
    <input class="tags-collector__input" type="text" placeholder="${defaults.l10n.placeholder}" autocomplete="off" autocapitalize="off" enterkeyhint="done" maxlength="${defaults.limitation.maxlength}" />
  </form>

  <div inert class="tags-collector__unit tags-collector__unit__decoy tags-collector__unit__decoy--mutate-axis">
    <span>web component</span>
    <button type="button" class="tags-collector__unit__remove stuff">
      remove
    </button>
  </div>
</div>
`;

const templateUnit = document.createElement('template');
templateUnit.innerHTML = `
<div class="tags-collector__unit a11y-block-link esc-dark-mode" tabindex="0" data-tag="{{content}}">
  <span>{{content}}</span>
  <button type="button" class="tags-collector__unit__remove stuff">
    remove
  </button>
</div>
`;

// Houdini Props and Vals
if (CSS?.registerProperty) {
  try {
    CSS.registerProperty({
      name: '--msc-tags-collector-input-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });

    CSS.registerProperty({
      name: '--msc-tags-collector-input-placeholder-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(151 158 168)'
    });

    CSS.registerProperty({
      name: '--msc-tags-collector-caret-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(35 42 49)'
    });

    CSS.registerProperty({
      name: '--msc-tags-collector-tag-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(70, 78, 86)'
    });

    CSS.registerProperty({
      name: '--msc-tags-collector-tag-background-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(224 228 233)'
    });

    CSS.registerProperty({
      name: '--msc-tags-collector-tag-focus-border-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(101 160 249)'
    });

    CSS.registerProperty({
      name: '--msc-tags-collector-tag-remove-color',
      syntax: '<color>',
      inherits: true,
      initialValue: 'rgba(91 99 106)'
    });
  } catch(err) {
    console.warn(`msc-tags-collector: ${err.message}`);
  }
}

export class MscTagsCollector extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: true });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: '',
      ddController: '',
      dX: 0,
      dY: 0,
      tags: []
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      collector: this.shadowRoot.querySelector('.tags-collector'),
      decoy: this.shadowRoot.querySelector('.tags-collector__unit__decoy'),
      input: this.shadowRoot.querySelector('.tags-collector__input'),
      activeTarget: '',
      units: []
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscTagsCollector(config)
    };

    // evts
    this._onDown = this._onDown.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onUp = this._onUp.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onTransitionend = this._onTransitionend.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onInputKeyDown = this._onInputKeyDown.bind(this);
  }

  async connectedCallback() {
   const { config, error } = await _wcl.getWCConfig(this);
   const { collector, input } = this.#nodes;

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // upgradeProperty
    const properties = Object.keys(defaults);
    const find = properties.splice(properties.findIndex((key) => key === 'illegalkeys'), 1);
    properties.unshift(find[0]); // put illegalkeys in first position
    properties.forEach((key) => this.#upgradeProperty(key));

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    collector.addEventListener(evtDown, this._onDown, { signal });
    collector.addEventListener('submit', this._onSubmit, { signal });
    collector.addEventListener('focus', this._onFocus, { signal });
    collector.addEventListener('keydown', this._onKeyDown, { signal, capture: true });
    collector.addEventListener('click', this._onClick, { signal });
    collector.addEventListener('transitionend', this._onTransitionend, { signal });
    input.addEventListener('input', this._onInput, { signal });
    input.addEventListener('keydown', this._onInputKeyDown, { signal });
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  #format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'illegalkeys': {
          let values;

          try {
            values = JSON.parse(newValue);

            if (!Array.isArray(values)) {
              throw new Error(`${_wcl.classToTagName(this.constructor.name)}: illegalkeys should be array.`);
            }
          } catch(err) {
            console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
            values = [...defaults[attrName]];
          }

          this.#config[attrName] = values;
          break;
        }

        case 'placeholder': {
          const { maxcount } = this.limitation;
          let values;

          try {
            values = JSON.parse(newValue);

            if (!Array.isArray(values)) {
              throw new Error(`${_wcl.classToTagName(this.constructor.name)}: placeholder should be array.`);
            }
          } catch(err) {
            console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
            values = [...defaults[attrName]];
          }

          this.#config[attrName] = values.slice(0, maxcount);
          break;
        }

        case 'limitation':
        case 'l10n': {
          let values;
          try {
            values = JSON.parse(newValue);
          } catch(err) {
            console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err.message}`);
            values = { ...defaults[attrName] };
          }
          this.#config[attrName] = values;
          break;
        }
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!MscTagsCollector.observedAttributes.includes(attrName)) {
      return;
    }

    this.#format(attrName, oldValue, newValue);

    switch (attrName) {
      case 'limitation': {
        const { input } = this.#nodes;
        const { maxlength } = {
          ...defaults.limitation,
          ...this.limitation
        };

        input.maxLength = maxlength;
        break;
      }

      case 'illegalkeys': {
        if (this.tagsInfo.length) {
          const tags = [...this.tagsInfo];

          this.removeAll();
          tags.forEach(
            (tag) => {
              this.#add(tag);
            }
          );
        }
        break;
      }

      case 'placeholder': {
        this.removeAll();

        this.placeholder.forEach(
          (tag) => {
            this.#add(tag);
          }
        );
        break;
      }

      case 'l10n': {
        const { input } = this.#nodes;
        const { placeholder } = {
          ...defaults.l10n,
          ...this.l10n
        };

        input.placeholder = placeholder;
        break;
      }
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscTagsCollector.observedAttributes
  }

  static get supportedKeyboardKeys() {
    return legalKey;
  }

  static get supportedEvents() {
    return Object.keys(custumEvents).map(
      (key) => {
        return custumEvents[key];
      }
    );
  }

  #upgradeProperty(prop) {
    let value;

    if (MscTagsCollector.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  set limitation(value) {
    if (value) {
      const newValue = {
        ...defaults.limitation,
        ...this.limitation,
        ...(typeof value === 'string' ? JSON.parse(value) : value)
      };
      this.setAttribute('limitation', JSON.stringify(newValue));
    } else {
      this.removeAttribute('limitation');
    }
  }

  get limitation() {
    return this.#config.limitation;
  }

  set l10n(value) {
    if (value) {
      const newValue = {
        ...defaults.l10n,
        ...this.l10n,
        ...(typeof value === 'string' ? JSON.parse(value) : value)
      };
      this.setAttribute('l10n', JSON.stringify(newValue));
    } else {
      this.removeAttribute('l10n');
    }
  }

  get l10n() {
    return this.#config.l10n;
  }

  set placeholder(value) {
    if (value) {
      const newValue = typeof value === 'string'
        ? JSON.parse(value)
        : (Array.isArray(value) ? value : defaults.placeholder);
      this.setAttribute('placeholder', JSON.stringify(newValue));
    } else {
      this.removeAttribute('placeholder');
    }
  }

  get placeholder() {
    return this.#config.placeholder;
  }

  set illegalkeys(value) {
    if (value) {
      const newValue = typeof value === 'string'
        ? JSON.parse(value)
        : (Array.isArray(value) ? value : defaults.illegalkeys);
      this.setAttribute('illegalkeys', JSON.stringify(newValue));
    } else {
      this.removeAttribute('illegalkeys');
    }
  }

  get illegalkeys() {
    return this.#config.illegalkeys;
  }

  get tagsInfo() {
    return this.#getUnits()
      .reduce(
        (acc, unit) => {
          return acc.concat(unit.dataset.tag); 
        }
      , []);
  }

  get count() {
    return this.#getUnits().length;
  }

  #getUnits() {
    return Array.from(this.#nodes.collector.querySelectorAll('.tags-collector__unit:not(.tags-collector__unit--dismiss)'));
  }

  #fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  #findOverTarget({ pX, pY }) {
    const { units, activeTarget } = this.#nodes;
    const sX = _wcl.scrollX;
    const sY = _wcl.scrollY;

    const index = units.findIndex(
      (unit) => {
        const { x, y, width, height } = unit.getBoundingClientRect();
        const startX = x + sX;
        const endX = startX + width;
        const startY = y + sY;
        const endY = startY + height;

        return pX >= startX && pX <= endX && pY >= startY && pY <= endY;
      }
    );

    return units[index] || activeTarget;
  }

  #swapUnits(overTarget) {
    const { collector, activeTarget } = this.#nodes;

    if (overTarget === activeTarget) {
      return;
    }

    if (activeTarget.nextElementSibling === overTarget) {
      overTarget.after(activeTarget);
    } else if (activeTarget.previousElementSibling === overTarget) {
      overTarget.before(activeTarget);
    } else {
      const activeNext = activeTarget.nextElementSibling;
      const overNext = overTarget.nextElementSibling;

      // move activeTarget
      if (overNext) {
        overNext.before(activeTarget);
      } else {
        collector.appendChild(activeTarget);
      }

      // move overTarget
      if (activeNext) {
        activeNext.before(overTarget);
      } else {
        collector.appendChild(overTarget);
      }
    }

    this.#updateStorage();
  }

  #mutateAxis({ pX, pY }) {
    const { dX, dY } = this.#data;

    _wcl.addStylesheetRules(
      '.tags-collector__unit__decoy--mutate-axis',
      {
        '--x': `${pX - _wcl.scrollX - dX}px`,
        '--y': `${pY - _wcl.scrollY - dY}px`
      },
      this.#nodes.styleSheet
    );
  }

  #add(tag = '') {
    const { collector, input } = this.#nodes;
    const { maxcount } = this.limitation;
    const content = tag || input.value.trim();
    let error = '';
    let illegalkey = '';

    if (!content) {
      error = 'empty content';
    } else if (this.count >= maxcount) {
      error = 'exceed maxcount';
    } else if (this.#data.tags.includes(content)) {
      error = 'duplicate tag';
    } else {
      const idx = this.illegalkeys.findIndex((key) => content.includes(key));

      if (idx !== -1) {
        error = 'contain illegal key';
        illegalkey = this.illegalkeys[idx];
      }
    }

    if (!error) {
      this.#data.tags.push(content);
      const templateString = Mustache.render(templateUnit.innerHTML, { content });
      collector.insertAdjacentHTML('beforeend', templateString);
      collector.appendChild(input);

      // show
      const unit = this.#getUnits().at(-1);
      setTimeout(
        () => {
          unit.classList.add('tags-collector__unit--ready');
        }
      , 100);

      this.#updateStorage();

      return true;
    } else {
      this.#fireEvent(custumEvents.error, {
        message: error,
        ...(this.#data.tags.includes(content) && { tag: content }),
        ...(illegalkey && { illegalkey })
      });
      
      return false;
    }
  }

  #removeTag(idx) {
    const units = this.#getUnits();

    if (!units[idx]) {
      return;
    }

    const unit = units[idx];
    const tag = unit.dataset.tag;
    const findIndex = this.#data.tags.indexOf(tag);
    this.#data.tags.splice(findIndex, 1);

    unit.classList.add('tags-collector__unit--dismiss');

    this.#updateStorage();
  }

  #updateStorage() {
    let storage = this.querySelector('input[type=hidden]');
    const tags = this.tagsInfo;

    if (!storage) {
      storage = document.createElement('input');
      storage.type = 'hidden';
      storage.name = 'msc-tags-collector';
      this.appendChild(storage);
    }

    storage.value = JSON.stringify(tags);

    this.#fireEvent(custumEvents.mutate, { tags });
  }

  _onDown(evt) {
    const button = evt.target.closest('button');
    const target = evt.target.closest('.tags-collector__unit');
    const { collector, decoy } = this.#nodes;
    const units = this.#getUnits();

    // remove
    if (button && target) {
      return;
    }

    if (!target || (typeof evt.buttons !== 'undefined' && evt.buttons !== 1) || collector.dataset.action) {
      return;
    }

    evt.preventDefault();

    collector.dataset.action = 'dragging';

    this.#data.ddController = new AbortController();
    const html = document.querySelector('html');
    const signal = this.#data.ddController.signal;
    const { x:pX, y:pY } = _wcl.pointer(evt);
    const { x, y } = target.getBoundingClientRect();
    const content = target.querySelector('span').textContent.trim();

    this.#data.dX = pX - (_wcl.scrollX + x);
    this.#data.dY = pY - (_wcl.scrollY + y);
    this.#nodes.activeTarget = target;
    this.#nodes.units = units;
    target.dataset.status = 'drag';
    target.focus();

    // decoy
    this.#mutateAxis({ pX, pY });
    decoy.querySelector('span').textContent= content;
    decoy.classList.toggle('tags-collector__unit__decoy--show', true);

    // evts
    html.addEventListener(evtMove, this._onMove, { signal });
    html.addEventListener(evtUp, this._onUp, { signal });
  }

  _onMove(evt) {
    const { collector } = this.#nodes;

    if ((typeof evt.buttons !== 'undefined' && evt.buttons !== 1) || !collector.dataset.action) {
      return;
    }

    const { x:pX, y:pY } = _wcl.pointer(evt);
    this.#mutateAxis({ pX, pY });

    this.#swapUnits(this.#findOverTarget({ pX, pY }));
  }

  _onUp(evt) {
    const { collector, activeTarget, decoy } = this.#nodes;

    if ((typeof evt.buttons !== 'undefined' && (evt.buttons & 1)) || !collector.dataset.action) {
      return;
    }

    this.#data.ddController.abort();
    delete collector.dataset.action;
    decoy.classList.toggle('tags-collector__unit__decoy--show', false);

    delete activeTarget.dataset.status;
    activeTarget.focus();

    this.#updateStorage();
  }

  _onFocus() {
    this.#nodes.input.focus();
  }

  _onSubmit(evt) {
    if (evt?.preventDefault) {
      evt.preventDefault();
    }
    
    if (this.#add()) {
      const { input } = this.#nodes;

      input.value = '';
      input.focus();
    }
  }

  _onClick(evt) {
    const button = evt.target.closest('button');
    const target = evt.target.closest('.tags-collector__unit');
    const units = this.#getUnits();

    if (button && target) {
      evt.preventDefault();
      this.#removeTag(units.indexOf(target));
    }
  }

  _onInputKeyDown(evt) {
    evt.stopPropagation();

    if (evt.key !== 'Backspace') {
      return;
    }

    const { input } = this.#nodes;
    const units = this.#getUnits();

    if (!input.value.length && units.length) {
      this.#removeTag(units.length - 1);
    }
  }

  _onKeyDown(evt) {
    const { collector } = this.#nodes;
    const { key } = evt;
    const target = this.shadowRoot.activeElement.closest('.tags-collector__unit');

    if (!MscTagsCollector.supportedKeyboardKeys.includes(key) || collector.dataset.action || !target) {
      return;
    }

    if (['ArrowLeft', 'ArrowRight'].includes(key)) {
      evt.preventDefault();
    }

    const units = this.#getUnits();
    const totalCount = this.count;
    const currentIndex = units.indexOf(target);
    this.#nodes.activeTarget = target;

    switch (key) {
      case 'Escape':
        target.blur();
        break;

      case 'Backspace': {
        this.#removeTag(units.indexOf(target));
        break;
      }

      case 'ArrowLeft': {
        const prevIndex = (currentIndex - 1 + totalCount) % totalCount;
        this.#swapUnits(units[prevIndex]);
        target.focus();
        break;
      }

      case 'ArrowRight': {
        const nextIndex = (currentIndex + 1 + totalCount) % totalCount;
        this.#swapUnits(units[nextIndex]);
        target.focus();
        break;
      }

    }
  }

  _onInput() {
    this.#fireEvent(custumEvents.input, { tag: this.#nodes.input.value.trim() });
  }

  _onTransitionend(evt) {
    const target = evt.target.closest('.tags-collector__unit');
    const { propertyName } = evt;

    if (
      target && 
      propertyName === 'transform' && 
      target.classList.contains('tags-collector__unit--dismiss')
    ) {
      target.remove();
    }
  }

  removeAll() {
    this.#getUnits()
      .forEach(
        (unit) => {
          unit.classList.add('tags-collector__unit--dismiss');
        }
      );

    this.#data.tags = [];
    this.#updateStorage();
  }

  addTag(tag = '') {
    this.#nodes.input.value = tag;
    this._onSubmit();
  }

  removeTag(tag = '') {
    const idx = this.#data.tags.indexOf(tag);

    if (idx === -1) {
      this.#fireEvent(custumEvents.error, {
        message: 'missing tag',
        tag
      });
      return;
    }

    this.#removeTag(idx);
  }

  focus() {
    this.#nodes.input.focus();
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscTagsCollector');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscTagsCollector'), MscTagsCollector);
}