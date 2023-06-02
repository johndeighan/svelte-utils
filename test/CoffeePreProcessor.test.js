// CoffeePreProcessor.test.coffee
var CoffeeTester, tester;

import {
  setDebugging
} from '@jdeighan/base-utils/debug';

import {
  JSTester
} from '@jdeighan/unit-tester/js';

import {
  coffeePreProcessor
} from '@jdeighan/svelte-utils/preprocessors';

// ---------------------------------------------------------------------------
CoffeeTester = class CoffeeTester extends JSTester {
  transformValue(content) {
    var hResult;
    hResult = coffeePreProcessor({
      content,
      attributes: {
        lang: 'coffee'
      },
      filename: 'example.svelte'
    });
    return hResult.code;
  }

};

tester = new CoffeeTester();

// ---------------------------------------------------------------------------
// Test normal JS
tester.equal(28, `fName = 'John'
lName = 'Deighan'`, `var fName, lName;
fName = 'John';
lName = 'Deighan';`);

// ---------------------------------------------------------------------------
// Test reactive block
tester.equal(40, `fName = 'John'
lName = 'Deighan'
$:
	fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`, `var fName, fullName, lName;
fName = 'John';
lName = 'Deighan';
$: {
	fullName = \`\${fName} \${lName}\`;
	console.log(\`fullName becomes \${fullName}\`);
	}`);

// ---------------------------------------------------------------------------
// Test reactive statement
tester.equal(59, `fName = 'John'
lName = 'Deighan'
$: fullName = "\#{fName} \#{lName}"`, `var fName, fullName, lName;
fName = 'John';
lName = 'Deighan';
$: fullName = \`\${fName} \${lName}\`;`);

// ---------------------------------------------------------------------------
// Test reactive statement with reactive block
tester.equal(73, `fName = 'John'
lName = 'Deighan'
$: fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`, `var fName, fullName, lName;
fName = 'John';
lName = 'Deighan';
$: fullName = \`\${fName} \${lName}\`;
$: {
	console.log(\`fullName becomes \${fullName}\`);
	}`);
