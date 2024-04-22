// preprocessors.test.coffee
var format, sp;

import prettierSync from '@prettier/sync';

({format} = prettierSync);

import {
  undef,
  spaces
} from '@jdeighan/base-utils';

import {
  setDebugging
} from '@jdeighan/base-utils/debug';

import {
  UnitTester
} from '@jdeighan/base-utils/utest';

import {
  coffeePreProcessor,
  i18nPreProcessor
} from '@jdeighan/svelte-utils/preprocessors';

sp = spaces(1);

// ---------------------------------------------------------------------------
(() => {
  var u;
  u = new UnitTester();
  u.transformValue = function(coffeeCode) {
    var result;
    result = coffeePreProcessor({
      content: coffeeCode,
      attributes: {
        lang: 'coffee'
      }
    });
    return result.code;
  };
  // ------------------------------------------------------------------------
  // --- test CoffeeScript to JavaScript conversion
  return u.equal(`fName = 'John'
lName = 'Deighan'
fullName = "\#{fName} \#{lName}"`, `var fName, fullName, lName;

fName = 'John';

lName = 'Deighan';

fullName = \`\${fName} \${lName}\`;`);
})();

// ---------------------------------------------------------------------------
(function() {
  var u;
  u = new UnitTester();
  u.transformValue = function(content) {
    var hResult;
    hResult = i18nPreProcessor({
      content,
      filename: 'example.svelte'
    });
    return hResult.code;
  };
  // ------------------------------------------------------------------------
  u.equal(`<h1>◄Hello, World!►</h1>`, `<h1>{translate('Hello, World!')}</h1>`);
  u.equal(`<h1>◄Hello, 'John'!►</h1>`, `<h1>{translate('Hello, \\'John\\'!')}</h1>`);
  return u.equal(`<h1>◄Hello, 'John'!►</h1>
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
})();

//# sourceMappingURL=preprocessors.test.js.map
