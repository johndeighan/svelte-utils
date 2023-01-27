# svelte.test.coffee

import {assert} from '@jdeighan/base-utils/exceptions'
import {utest} from '@jdeighan/unit-tester'
import {
	svelteSourceCodeEsc, svelteHtmlEsc,
	} from '@jdeighan/svelte-utils'

# ---------------------------------------------------------------------------

utest.equal 11, svelteSourceCodeEsc('<abc>'), '&lt;abc&gt;'
utest.equal 12, svelteHtmlEsc('{abc}'), '&lbrace;abc&rbrace;'
