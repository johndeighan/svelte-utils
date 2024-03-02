// PreProcessors.test.coffee
var format, sp;

import prettierSync from '@prettier/sync';

({format} = prettierSync);

import {
  undef,
  LOG,
  spaces
} from '@jdeighan/base-utils';

import {
  setDebugging
} from '@jdeighan/base-utils/debug';

import {
  UnitTester
} from '@jdeighan/base-utils/utest';

import {
  preProc,
  postProc,
  marker,
  jsmarker,
  brew,
  coffeePreProcessor,
  i18nPreProcessor
} from '@jdeighan/svelte-utils/preprocessors';

sp = spaces(1);

// ---------------------------------------------------------------------------
(() => {
  var u;
  u = new UnitTester();
  u.transformValue = function(block) {
    return preProc(block).code;
  };
  // ------------------------------------------------------------------------
  // --- test reactive statements
  u.equal(`fName = 'John'
lName = 'Deighan'

$: fullName = "\#{fName} \#{lName}"`, `fName = 'John'
lName = 'Deighan'

${marker}
fullName = "\#{fName} \#{lName}"`);
  u.equal(`fName = 'John'
lName = 'Deighan'

#reactive fullName = "\#{fName} \#{lName}"`, `fName = 'John'
lName = 'Deighan'

${marker}
fullName = "\#{fName} \#{lName}"`);
  // ------------------------------------------------------------------------
  // --- test reactive block
  u.equal(`fName = 'John'
lName = 'Deighan'

$:
	fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`, `fName = 'John'
lName = 'Deighan'

if true ${marker}
	fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`);
  u.equal(`fName = 'John'
lName = 'Deighan'

#reactive
	fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`, `fName = 'John'
lName = 'Deighan'

if true ${marker}
	fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`);
  // ------------------------------------------------------------------------
  // --- test reactive statement with reactive block
  u.equal(`fName = 'John'
lName = 'Deighan'

$: fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`, `fName = 'John'
lName = 'Deighan'

${marker}
fullName = "\#{fName} \#{lName}"
if true ${marker}
	console.log "fullName becomes \#{fullName}"`);
  return u.equal(`fName = 'John'
lName = 'Deighan'

#reactive fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`, `fName = 'John'
lName = 'Deighan'

${marker}
fullName = "\#{fName} \#{lName}"
if true ${marker}
	console.log "fullName becomes \#{fullName}"`);
})();

// ---------------------------------------------------------------------------
(() => {
  var u;
  u = new UnitTester();
  u.transformValue = function(block) {
    return postProc(block).code;
  };
  // ------------------------------------------------------------------------
  // --- test reactive statements
  u.equal(`var fName, fullName, lName;

fName = 'John';

lName = 'Deighan';

${jsmarker}
fullName = \`\${fName} \${lName}\`;
`, `var fName, fullName, lName;

fName = 'John';

lName = 'Deighan';

$: fullName = \`\${fName} \${lName}\`;
`);
  // ------------------------------------------------------------------------
  // --- test reactive block
  u.equal(`var fName, fullName, lName;

fName = 'John';

lName = 'Deighan';

if (true) { ${jsmarker}
${sp}${sp}fullName = \`\${fName} \${lName}\`;
${sp}${sp}console.log(\`fullName becomes \${fullName}\`);
}
`, `var fName, fullName, lName;

fName = 'John';

lName = 'Deighan';

$: {
${sp}${sp}fullName = \`\${fName} \${lName}\`;
${sp}${sp}console.log(\`fullName becomes \${fullName}\`);
}
`);
  // ------------------------------------------------------------------------
  // --- test reactive statement with reactive block
  return u.equal(`var fName, fullName, lName;

fName = 'John';

lName = 'Deighan';

${jsmarker}
fullName = \`\${fName} \${lName}\`;

if (true) { ${jsmarker}
${sp}${sp}console.log(\`fullName becomes \${fullName}\`);
}
`, `var fName, fullName, lName;

fName = 'John';

lName = 'Deighan';

$: fullName = \`\${fName} \${lName}\`;

$: {
${sp}${sp}console.log(\`fullName becomes \${fullName}\`);
}
`);
})();

// ---------------------------------------------------------------------------
(() => {
  var normalize, u;
  normalize = function(jsStr) {
    var result;
    result = format(jsStr, {
      parser: 'flow',
      useTabs: true
    });
    return result.replace(/\n\n+/sg, "\n");
  };
  // ------------------------------------------------------------------------
  u = new UnitTester();
  u.transformValue = (code) => {
    var hResult;
    hResult = coffeePreProcessor({
      content: code,
      attributes: {
        lang: 'coffee'
      },
      filename: 'example.svelte'
    });
    return normalize(hResult.code);
  };
  u.transformExpected = normalize;
  // ------------------------------------------------------------------------
  // Test normal JS
  u.equal(`fName = 'John'
lName = 'Deighan'`, `var fName, lName;
fName = 'John';
lName = 'Deighan';`);
  // ------------------------------------------------------------------------
  // Test reactive block
  u.equal(`fName = 'John'
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
  // ------------------------------------------------------------------------
  // Test reactive statement
  u.equal(`fName = 'John'
lName = 'Deighan'
$: fullName = "\#{fName} \#{lName}"`, `var fName, fullName, lName;
fName = 'John';
lName = 'Deighan';
$: fullName = \`\${fName} \${lName}\`;`);
  // ------------------------------------------------------------------------
  // Test reactive statement with reactive block
  return u.equal(`fName = 'John'
lName = 'Deighan'
$: fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`, `var fName, fullName, lName;
fName = 'John';
lName = 'Deighan';
$: fullName = \`\${fName} \${lName}\`;
$: {
	console.log(\`fullName becomes \${fullName}\`);
	}`);
})();

// ---------------------------------------------------------------------------
(() => {
  var u;
  u = new UnitTester();
  u.transformValue = function(block) {
    return brew(block).code;
  };
  // ------------------------------------------------------------------------
  // --- test reactive statements
  u.equal(`fName = 'John'
lName = 'Deighan'

${marker}
fullName = "\#{fName} \#{lName}"`, `var fName, fullName, lName;

fName = 'John';

lName = 'Deighan';

${jsmarker}
fullName = \`\${fName} \${lName}\`;
`);
  // ------------------------------------------------------------------------
  // --- test reactive block
  u.equal(`fName = 'John'
lName = 'Deighan'

if true ${marker}
	fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`, `var fName, fullName, lName;

fName = 'John';

lName = 'Deighan';

if (true) { ${jsmarker}
${sp}${sp}fullName = \`\${fName} \${lName}\`;
${sp}${sp}console.log(\`fullName becomes \${fullName}\`);
}
`);
  // ------------------------------------------------------------------------
  // --- test reactive statement with reactive block
  return u.equal(`fName = 'John'
lName = 'Deighan'

${marker}
fullName = "\#{fName} \#{lName}"
if true ${marker}
	console.log "fullName becomes \#{fullName}"`, `var fName, fullName, lName;

fName = 'John';

lName = 'Deighan';

${jsmarker}
fullName = \`\${fName} \${lName}\`;

if (true) { ${jsmarker}
${sp}${sp}console.log(\`fullName becomes \${fullName}\`);
}
`);
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

//# sourceMappingURL=PreProcessors.test.js.map
