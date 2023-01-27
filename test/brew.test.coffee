# brew.test.coffee

import {setDebugging} from '@jdeighan/base-utils/debug'
import {
	utest, UnitTester, UnitTesterNorm,
	} from '@jdeighan/unit-tester'
import {
	brew, marker, jsmarker,
	} from '@jdeighan/svelte-utils/preprocessors'

sp = ' '

# ---------------------------------------------------------------------------

class BrewTester extends UnitTester

	transformValue: (block) ->

		return brew(block).code

tester = new BrewTester()

# ---------------------------------------------------------------------------
# --- test reactive statements

tester.equal 26, """
	fName = 'John'
	lName = 'Deighan'

	#{marker}
	fullName = "\#{fName} \#{lName}"
	""", """
	var fName, fullName, lName;

	fName = 'John';

	lName = 'Deighan';

	#{jsmarker}
	fullName = `${fName} ${lName}`;

	"""

# ---------------------------------------------------------------------------
# --- test reactive block

tester.equal 47, """
	fName = 'John'
	lName = 'Deighan'

	if true #{marker}
		fullName = "\#{fName} \#{lName}"
		console.log "fullName becomes \#{fullName}"
	""", """
	var fName, fullName, lName;

	fName = 'John';

	lName = 'Deighan';

	if (true) { #{jsmarker}
	#{sp}#{sp}fullName = `${fName} ${lName}`;
	#{sp}#{sp}console.log(`fullName becomes ${fullName}`);
	}

	"""

# ---------------------------------------------------------------------------
# --- test reactive statement with reactive block

tester.equal 71, """
	fName = 'John'
	lName = 'Deighan'

	#{marker}
	fullName = "\#{fName} \#{lName}"
	if true #{marker}
		console.log "fullName becomes \#{fullName}"
	""", """
	var fName, fullName, lName;

	fName = 'John';

	lName = 'Deighan';

	#{jsmarker}
	fullName = `${fName} ${lName}`;

	if (true) { #{jsmarker}
	#{sp}#{sp}console.log(`fullName becomes ${fullName}`);
	}

	"""
