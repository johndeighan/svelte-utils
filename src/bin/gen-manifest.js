#!/usr/bin/env node
;
var fname;

import {
  // gen-manifest.coffee
  undef
} from '@jdeighan/base-utils';

import {
  genManifest
} from '@jdeighan/svelte-utils';

fname = (await genManifest({
  appName: 'Super App',
  appShortName: 'Super',
  developerName: 'John Deighan'
}));

console.log(`Manifest file at ${fname}`);
