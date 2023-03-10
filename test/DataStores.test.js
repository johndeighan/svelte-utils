// Generated by CoffeeScript 2.7.0
  // DataStores.test.coffee
import {
  undef
} from '@jdeighan/base-utils';

import {
  assert
} from '@jdeighan/base-utils/exceptions';

import {
  utest
} from '@jdeighan/unit-tester';

import {
  WritableDataStore,
  LocalStorageDataStore,
  PropsDataStore,
  TAMLDataStore
} from '@jdeighan/svelte-utils/stores';

// ---------------------------------------------------------------------------
(function() {
  var store, unsub, value;
  store = new TAMLDataStore(`---
- a
- b
- c`);
  value = undef;
  unsub = store.subscribe(function(val) {
    return value = val;
  });
  utest.equal(21, value, ['a', 'b', 'c']);
  return unsub();
})();
