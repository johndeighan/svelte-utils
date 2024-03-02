  // svelte-utils.test.coffee
import {
  assert
} from '@jdeighan/base-utils/exceptions';

import {
  equal
} from '@jdeighan/base-utils/utest';

import {
  svelteSourceCodeEsc,
  svelteHtmlEsc,
  getManifestOptions,
  genManifest,
  makeReactive
} from '@jdeighan/svelte-utils';

// ---------------------------------------------------------------------------
equal(svelteSourceCodeEsc('<abc>'), '&lt;abc&gt;');

equal(svelteHtmlEsc('{abc}'), '&lbrace;abc&rbrace;');

equal(getManifestOptions(), {
  src: "./static/favicon.svg",
  dest: "./static/favicons",
  path: "/favicons",
  appName: "My Great App",
  appShortName: "Great App",
  appDescription: "A great application",
  developerName: 'John Doe',
  version: '1.0.0',
  manifestFileName: 'manifest.json',
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    favicons: true,
    windows: false,
    yandex: false
  },
  files: {
    android: {
      manifestFileName: 'manifest.json'
    }
  }
});

equal(getManifestOptions({
  developerName: 'John Deighan'
}), {
  src: "./static/favicon.svg",
  dest: "./static/favicons",
  path: "/favicons",
  appName: "My Great App",
  appShortName: "Great App",
  appDescription: "A great application",
  developerName: 'John Deighan',
  version: '1.0.0',
  manifestFileName: 'manifest.json',
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    favicons: true,
    windows: false,
    yandex: false
  },
  files: {
    android: {
      manifestFileName: 'manifest.json'
    }
  }
});

equal(getManifestOptions({
  appName: 'Super App'
}), {
  src: "./static/favicon.svg",
  dest: "./static/favicons",
  path: "/favicons",
  appName: "Super App",
  appShortName: "Great App",
  appDescription: "A great application",
  developerName: 'John Doe',
  version: '1.0.0',
  manifestFileName: 'manifest.json',
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    favicons: true,
    windows: false,
    yandex: false
  },
  files: {
    android: {
      manifestFileName: 'manifest.json'
    }
  }
});

//# sourceMappingURL=svelte-utils.test.js.map
