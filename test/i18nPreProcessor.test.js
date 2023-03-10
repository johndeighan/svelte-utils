// Generated by CoffeeScript 2.7.0
// i18nPreProcessor.test.coffee
var TranslateTester, tester;

import {
  setDebugging
} from '@jdeighan/base-utils/debug';

import {
  UnitTester
} from '@jdeighan/unit-tester';

import {
  i18nPreProcessor
} from '@jdeighan/svelte-utils/preprocessors';

// ---------------------------------------------------------------------------
TranslateTester = class TranslateTester extends UnitTester {
  transformValue(content) {
    var hResult;
    hResult = i18nPreProcessor({
      content,
      filename: 'example.svelte'
    });
    return hResult.code;
  }

};

tester = new TranslateTester();

// ---------------------------------------------------------------------------
tester.equal(26, `<h1>◄Hello, World!►</h1>`, `<h1>{translate('Hello, World!')}</h1>`);

tester.equal(32, `<h1>◄Hello, 'John'!►</h1>`, `<h1>{translate('Hello, \\'John\\'!')}</h1>`);

tester.equal(38, `<h1>◄Hello, 'John'!►</h1>
<div>
	◄Today is Christmas!►
</div>
<div>
	◄Merry Christmas!►
</div>`, `<h1>{translate('Hello, \\'John\\'!')}</h1>
<div>
	{translate('Today is Christmas!')}
</div>
<div>
	{translate('Merry Christmas!')}
</div>`);
