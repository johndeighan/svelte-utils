// svelte-utils.coffee
import favicons from 'favicons';

import fs from 'fs/promises';

import pathLib from 'path';

import {
  mkpath,
  barf
} from '@jdeighan/base-utils/fs';

import {
  fileExt,
  isFile,
  isDir,
  mkdirSync,
  execCmdSync
} from '@jdeighan/coffee-utils/fs';

import {
  isFunction,
  getOptions
} from '@jdeighan/base-utils';

import {
  assert,
  croak
} from '@jdeighan/base-utils/exceptions';

import {
  LOG
} from '@jdeighan/base-utils/log';

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
    mkdirSync(dest);
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
