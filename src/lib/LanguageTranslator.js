// LanguageTranslator.coffee
import fetch from 'node-fetch';

import {
  v4 as uuid
} from 'uuid';

import * as dotenv from 'dotenv';

dotenv.config();

import {
  undef,
  defined,
  notdefined,
  pass
} from '@jdeighan/base-utils';

import {
  assert
} from '@jdeighan/base-utils/exceptions';

import {
  dbgEnter,
  dbgReturn,
  dbg
} from '@jdeighan/base-utils/debug';

// ---------------------------------------------------------------------------
export var LanguageTranslator = class LanguageTranslator {
  constructor() {
    // --- { <from>: <to>: <str>: <translation, ... }
    this.hCache = {};
  }

  // ..........................................................
  getFromCache(str, from, to) {
    var h, h2, result;
    dbgEnter('getFromCache', str, from, to);
    dbg('cache', this.hCache);
    if (defined(h = this.hCache[from]) && defined(h2 = h[to]) && defined(result = h2[str])) {
      dbgReturn('getFromCache', result);
      return result;
    } else {
      dbgReturn('getFromCache', undef);
      return undef;
    }
  }

  // ..........................................................
  putIntoCache(str, from, to, translated) {
    var h;
    dbgEnter('putIntoCache', str, from, to, translated);
    if (!this.hCache.hasOwnProperty(from)) {
      this.hCache[from] = {};
    }
    h = this.hCache[from];
    if (!h.hasOwnProperty(to)) {
      h[to] = {};
    }
    h = h[to];
    assert(!h.hasOwnProperty(str));
    h[str] = translated;
    dbgReturn('putIntoCache');
  }

  // ..........................................................
  async translate(str, from, to) {
    var translated;
    dbgEnter('translate', str, from, to);
    if (translated = this.getFromCache(str, from, to)) {
      dbg("found previous translation");
      dbgReturn('translate', translated);
      return translated;
    }
    translated = (await this.translateStr(str, from, to));
    this.putIntoCache(str, from, to, translated);
    dbgReturn('translate', translated);
    return translated;
  }

  // ..........................................................
  translateStr(str, from, to) {
    return str;
  }

};

// ---------------------------------------------------------------------------
export var MSTranslator = class MSTranslator extends LanguageTranslator {
  constructor() {
    super();
    this.baseURL = process.env['TRANSLATE_URL'];
    this.key = process.env['TRANSLATE_KEY'];
    this.location = process.env['TRANSLATE_LOCATION'];
  }

  // ..........................................................
  async translateStr(str, from, to) {
    var body, data, resp, url;
    // --- construct the URL
    url = new URL(this.baseURL);
    url.searchParams.set('api-version', '3.0');
    url.searchParams.set('from', from);
    url.searchParams.set('to', to);
    body = [
      {
        text: str
      }
    ];
    resp = (await fetch(url, {
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': this.key,
        'Ocp-Apim-Subscription-Region': this.location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuid().toString()
      },
      body: JSON.stringify(body)
    }));
    data = (await resp.json());
    return data[0].translations[0].text;
  }

};

//# sourceMappingURL=LanguageTranslator.js.map
