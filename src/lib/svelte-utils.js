// svelte-utils.coffee
import favicons from 'favicons';

import fs from 'fs/promises';

import pathLib from 'path';

import {
  isString,
  isClass,
  isFunction,
  getOptions,
  execCmd
} from '@jdeighan/base-utils';

import {
  assert,
  croak
} from '@jdeighan/base-utils/exceptions';

import {
  LOG
} from '@jdeighan/base-utils/log';

import {
  mkpath,
  barf
} from '@jdeighan/base-utils/fs';

import {
  fileExt,
  isFile,
  isDir,
  mkDir
} from '@jdeighan/coffee-utils/fs';

// ---------------------------------------------------------------------------
//   svelteSourceCodeEsc - to display source code for a *.starbucks page
export var svelteSourceCodeEsc = (str) => {
  return str.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\{/g, '&lbrace;').replace(/\}/g, '&rbrace;').replace(/\$/g, '&dollar;');
};

// ---------------------------------------------------------------------------
//   svelteHtmlEsc - after converting markdown
export var svelteHtmlEsc = (str) => {
  return str.replace(/\{/g, '&lbrace;').replace(/\}/g, '&rbrace;').replace(/\$/g, '&dollar;');
};

// ---------------------------------------------------------------------------
// --- export only to allow unit tests
export var getManifestOptions = (hOptions = {}) => {
  var hDefaultOptions;
  // --- These are defaults - all can be overridden
  hDefaultOptions = {
    src: "./static/favicon.svg",
    dest: "./static/favicons",
    path: "/favicons",
    appName: "My Great App",
    appShortName: "Great App",
    appDescription: "A great application",
    developerName: 'John Doe',
    version: '1.0.0',
    manifestFileName: 'manifest.json'
  };
  hOptions = getOptions(hOptions, hDefaultOptions);
  return {
    src: hOptions.src,
    dest: hOptions.dest,
    path: hOptions.path,
    appName: hOptions.appName,
    appShortName: hOptions.appShortName,
    appDescription: hOptions.appDescription,
    developerName: hOptions.developerName,
    version: hOptions.version,
    manifestFileName: hOptions.manifestFileName,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: true,
      favicons: true,
      windows: false,
      yandex: false
    },
    files: {
      android: {
        manifestFileName: 'manifest.json'
      }
    }
  };
};

// ---------------------------------------------------------------------------
export var genManifest = async(hOptions = {}) => {
  var dest, files, html, images, manifestFileName, src;
  hOptions = getManifestOptions(hOptions);
  ({dest, src, manifestFileName} = hOptions);
  if (!isDir(dest)) {
    mkdir(dest);
  }
  assert(fileExt(src).toLowerCase() === '.svg', "Source not an SVG file");
  ({images, files, html} = (await favicons(src, hOptions)));
  images.map((image) => {
    return barf(image.contents, dest, image.name);
  });
  files.map((file) => {
    return barf(file.contents, dest, file.name);
  });
  barf(html.join("\n"), dest, 'icons.html');
  return mkpath(dest, manifestFileName);
};

// ---------------------------------------------------------------------------
export var onInterval = (func, secs, doLog = false) => {
  var interval, ms;
  assert(isFunction(func), "onInterval(): 1st arg not a function");
  ms = Math.floor(1000 * secs);
  if (doLog) {
    LOG(`calling func every ${ms} ms.`);
  }
  interval = setInterval(func, ms);
  return function() {
    if (doLog) {
      LOG("destroying interval timer");
    }
    return clearInterval(interval);
  };
};

// ---------------------------------------------------------------------------
export var makeReactive = (aClass, aMethod) => {
  var func, newfunc;
  assert(isClass(aClass), "aClass is not a class");
  assert(isString(aMethod), "aMethod is not a string");
  func = aClass.prototype[aMethod];
  assert(isFunction(func), "aMethod is not a method");
  newfunc = (...lArgs) => {
    return func(...lArgs);
  };
  assert(isFunction(newfunc), "newfunc is not a function");
  aClass.prototype[aMethod] = newfunc;
  return undef;
};

//# sourceMappingURL=svelte-utils.js.map
