// postProc.test.coffee
var PostTester, sp, tester;

import {
  setDebugging
} from '@jdeighan/base-utils/debug';

import {
  utest,
  UnitTester,
  UnitTesterNorm
} from '@jdeighan/unit-tester';

import {
  postProc,
  marker,
  jsmarker
} from '@jdeighan/svelte-utils/preprocessors';

sp = ' ';

// ---------------------------------------------------------------------------
PostTester = class PostTester extends UnitTesterNorm {
  transformValue(block) {
    return postProc(block).code;
  }

};

tester = new PostTester();

// ---------------------------------------------------------------------------
// --- test reactive statements
tester.equal(26, `var fName, fullName, lName;

fName = 'John';

lName = 'Deighan';

${jsmarker}
fullName = \`\${fName} \${lName}\`;
`, `var fName, fullName, lName;

fName = 'John';

lName = 'Deighan';

$: fullName = \`\${fName} \${lName}\`;
`);

// ---------------------------------------------------------------------------
// --- test reactive block
tester.equal(51, `var fName, fullName, lName;

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

// ---------------------------------------------------------------------------
// --- test reactive statement with reactive block
tester.equal(80, `var fName, fullName, lName;

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
