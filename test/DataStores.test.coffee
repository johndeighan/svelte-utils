# DataStores.test.coffee

import {undef} from '@jdeighan/base-utils'
import {assert} from '@jdeighan/base-utils/exceptions'
import {utest} from '@jdeighan/unit-tester'
import {
	WritableDataStore, LocalStorageDataStore, PropsDataStore,
	TAMLDataStore,
	} from '@jdeighan/svelte-utils/stores'

# ---------------------------------------------------------------------------

(() ->
	store = new TAMLDataStore("""
		---
		- a
		- b
		- c
		""")

	value = undef
	unsub = store.subscribe((val) -> value = val)

	utest.equal 21, value, ['a','b','c']
	unsub()
	)()

