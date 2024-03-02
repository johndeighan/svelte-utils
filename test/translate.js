// translate.coffee
var mstrans, str, translated;

import fetch from 'node-fetch';

import {
  v4 as uuid
} from 'uuid';

import {
  setDebugging
} from '@jdeighan/base-utils/debug';

import {
  MSTranslator
} from '@jdeighan/svelte-utils/translator';

// ---------------------------------------------------------------------------
mstrans = new MSTranslator();

str = 'hello';

translated = (await mstrans.translate(str, 'en', 'zh'));

console.log(`${str} => ${translated}`);

translated = (await mstrans.translate(str, 'en', 'zh'));

console.log(`${str} => ${translated}`);

//# sourceMappingURL=translate.js.map
