# DataStores.test.coffee

import {undef} from '@jdeighan/base-utils'
import {assert} from '@jdeighan/base-utils/exceptions'
import {equal} from '@jdeighan/base-utils/utest'
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

	equal value, ['a','b','c']
	unsub()
	)()

