  // data-stores.test.coffee
import {
  undef
} from '@jdeighan/base-utils';

import {
  assert
} from '@jdeighan/base-utils/exceptions';

import {
  equal
} from '@jdeighan/base-utils/utest';

import {
  WritableDataStore,
  LocalStorageDataStore,
  PropsDataStore,
  TAMLDataStore
} from '@jdeighan/svelte-utils/data-stores';

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
  equal(value, ['a', 'b', 'c']);
  return unsub();
})();

//# sourceMappingURL=data-stores.test.js.map
