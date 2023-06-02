// DataStores.coffee
import pathlib from 'path';

import {
  writable,
  readable,
  get
} from 'svelte/store';

import {
  undef,
  defined,
  notdefined,
  pass,
  range,
  getOptions
} from '@jdeighan/base-utils';

import {
  assert,
  croak
} from '@jdeighan/base-utils/exceptions';

import {
  fromTAML
} from '@jdeighan/base-utils/taml';

import {
  slurp,
  barf
} from '@jdeighan/base-utils/fs';

import {
  localStore
} from '@jdeighan/coffee-utils/browser';

import {
  withExt,
  newerDestFileExists
} from '@jdeighan/coffee-utils/fs';

// ---------------------------------------------------------------------------
export var StaticDataStore = class StaticDataStore {
  constructor(value) {
    this.value = value;
  }

  subscribe(cbFunc) {
    cbFunc(this.value);
    return function() {
      return pass();
    };
  }

  set(val) {
    return croak("Can't set() a StaticDataStore");
  }

  update(func) {
    return croak("Can't update() a StaticDataStore");
  }

};

// ---------------------------------------------------------------------------
export var WritableDataStore = class WritableDataStore {
  constructor(value = undef) {
    this.store = writable(value);
  }

  subscribe(func) {
    return this.store.subscribe(func);
  }

  set(value) {
    this.store.set(value);
  }

  update(func) {
    this.store.update(func);
  }

};

// ---------------------------------------------------------------------------
export var LocalStorageDataStore = class LocalStorageDataStore extends WritableDataStore {
  constructor(masterKey1, defValue = undef) {
    var value;
    super(defValue);
    this.masterKey = masterKey1;
    value = localStore(this.masterKey);
    if (defined(value)) {
      this.set(value);
    }
  }

  // --- I'm assuming that when update() is called,
  //     set() will also be called
  set(value) {
    assert(defined(value), "set(): cannot set to undef");
    super.set(value);
    localStore(this.masterKey, value);
  }

  update(func) {
    super.update(func);
    localStore(this.masterKey, get(this.store));
  }

};

// ---------------------------------------------------------------------------
export var PropsDataStore = class PropsDataStore extends LocalStorageDataStore {
  constructor(masterKey, defValue = undef) {
    super(masterKey, {});
  }

  setProp(name, value) {
    assert(defined(name), "PropStore.setProp(): empty key");
    this.update(function(hPrefs) {
      hPrefs[name] = value;
      return hPrefs;
    });
  }

};

// ---------------------------------------------------------------------------
export var ReadableDataStore = class ReadableDataStore {
  constructor() {
    this.store = readable(null, function(set) {
      this.setter = set; // store the setter function
      this.start(); // call your start() method
      return () => {
        return this.stop(); // return function capable of stopping
      };
    });
  }

  subscribe(callback) {
    return this.store.subscribe(callback);
  }

  start() {}

  stop() {}

};

// ---------------------------------------------------------------------------
export var DateTimeDataStore = class DateTimeDataStore extends ReadableDataStore {
  start() {
    // --- We need to store this interval for use in stop() later
    this.interval = setInterval(function() {
      return this.setter(new Date(), 1000);
    });
  }

  stop() {
    clearInterval(this.interval);
  }

};

// ---------------------------------------------------------------------------
export var MousePosDataStore = class MousePosDataStore extends ReadableDataStore {
  start() {
    // --- We need to store this handler for use in stop() later
    this.mouseMoveHandler = function(e) {
      return this.setter({
        x: e.clientX,
        y: e.clientY
      });
    };
    document.body.addEventListener('mousemove', this.mouseMoveHandler);
  }

  stop() {
    document.body.removeEventListener('mousemove', this.mouseMoveHandler);
  }

};

// ---------------------------------------------------------------------------
export var TAMLDataStore = class TAMLDataStore extends WritableDataStore {
  constructor(str) {
    super(fromTAML(str));
  }

};

// ---------------------------------------------------------------------------
// --- Mainly for better understanding, I've implemented data stores
//     without using svelte's readable or writable data stores
export var BaseDataStore = class BaseDataStore {
  constructor(value1 = undef) {
    this.value = value1;
    this.lSubscribers = [];
  }

  subscribe(cbFunc) {
    cbFunc(this.value);
    this.lSubscribers.push(cbFunc);
    return function() {
      var index;
      index = this.lSubscribers.indexOf(cbFunc);
      return this.lSubscribers.splice(index, 1);
    };
  }

  set(val) {
    this.value = val;
  }

  update(func) {
    this.value = func(this.value);
    this.alertSubscribers();
  }

  alertSubscribers() {
    var cbFunc, i, len, ref;
    ref = this.lSubscribers;
    for (i = 0, len = ref.length; i < len; i++) {
      cbFunc = ref[i];
      cbFunc(this.value);
    }
  }

};

// ---------------------------------------------------------------------------
export var ToDoDataStore = class ToDoDataStore extends BaseDataStore {
  constructor() {
    var lToDos;
    lToDos = []; // save local reference to make code easier to grok
    super(lToDos);
    this.lToDos = lToDos; // can't do this before calling super
  }

  set(val) {
    return croak("Don't use set()");
  }

  update(func) {
    return croak("Don't use update()");
  }

  find(name) {
    var i, index, len, ref;
    ref = range(this.lToDos.length);
    // --- returns index
    for (i = 0, len = ref.length; i < len; i++) {
      index = ref[i];
      if (this.lToDos[index].text === name) {
        return index;
      }
    }
    return undef;
  }

  clear() {
    // --- Don't set a new array. That would break our reference
    this.lToDos.splice(0, this.lToDos.length);
  }

  add(name) {
    assert(notdefined(this.find(name)), `Todo ${name} already exists`);
    this.lToDos.push({
      text: name,
      done: false
    });
    this.alertSubscribers();
  }

  remove(name) {
    var index;
    index = this.find(name);
    this.lToDos.splice(index, 1);
    this.alertSubscribers();
  }

};

// ---------------------------------------------------------------------------
//         UTILITIES
// ---------------------------------------------------------------------------
export var brewTamlStr = (code, stub) => {
  return `import {TAMLDataStore} from '@jdeighan/starbucks/stores';

export let ${stub} = new TAMLDataStore(\`${code}\`);`;
};

// ---------------------------------------------------------------------------
export var brewTamlFile = (srcPath, destPath = undef, hOptions = {}) => {
  var force, hInfo, jsCode, stub, tamlCode;
  // --- taml => js
  //     Valid Options:
  //        force
  if (notdefined(destPath)) {
    destPath = withExt(srcPath, '.js');
  }
  ({force} = getOptions(hOptions));
  if (force || !newerDestFileExists(srcPath, destPath)) {
    hInfo = pathlib.parse(destPath);
    stub = hInfo.name;
    tamlCode = slurp(srcPath);
    jsCode = brewTamlStr(tamlCode, stub);
    barf(jsCode, destPath);
  }
};

// ---------------------------------------------------------------------------
