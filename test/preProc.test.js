// preProc.test.coffee
var PreTester, tester;

import {
  setDebugging
} from '@jdeighan/base-utils/debug';

import {
  utest,
  UnitTester,
  UnitTesterNorm
} from '@jdeighan/unit-tester';

import {
  preProc,
  marker,
  jsmarker
} from '@jdeighan/svelte-utils/preprocessors';

// ---------------------------------------------------------------------------
PreTester = class PreTester extends UnitTester {
  transformValue(block) {
    return preProc(block).code;
  }

};

tester = new PreTester();

// ---------------------------------------------------------------------------
// --- test reactive statements
tester.equal(24, `fName = 'John'
lName = 'Deighan'

$: fullName = "\#{fName} \#{lName}"`, `fName = 'John'
lName = 'Deighan'

${marker}
fullName = "\#{fName} \#{lName}"`);

tester.equal(37, `fName = 'John'
lName = 'Deighan'

#reactive fullName = "\#{fName} \#{lName}"`, `fName = 'John'
lName = 'Deighan'

${marker}
fullName = "\#{fName} \#{lName}"`);

// ---------------------------------------------------------------------------
// --- test reactive block
tester.equal(53, `fName = 'John'
lName = 'Deighan'

$:
	fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`, `fName = 'John'
lName = 'Deighan'

if true ${marker}
	fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`);

tester.equal(69, `fName = 'John'
lName = 'Deighan'

#reactive
	fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`, `fName = 'John'
lName = 'Deighan'

if true ${marker}
	fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`);

// ---------------------------------------------------------------------------
// --- test reactive statement with reactive block
tester.equal(88, `fName = 'John'
lName = 'Deighan'

$: fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`, `fName = 'John'
lName = 'Deighan'

${marker}
fullName = "\#{fName} \#{lName}"
if true ${marker}
	console.log "fullName becomes \#{fullName}"`);

tester.equal(104, `fName = 'John'
lName = 'Deighan'

#reactive fullName = "\#{fName} \#{lName}"
	console.log "fullName becomes \#{fullName}"`, `fName = 'John'
lName = 'Deighan'

${marker}
fullName = "\#{fName} \#{lName}"
if true ${marker}
	console.log "fullName becomes \#{fullName}"`);
