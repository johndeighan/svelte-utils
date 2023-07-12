# svelte-utils.test.coffee

import {assert} from '@jdeighan/base-utils/exceptions'
import {utest} from '@jdeighan/unit-tester'
import {
	svelteSourceCodeEsc, svelteHtmlEsc, getManifestOptions,
	genManifest, makeReactive,
	} from '@jdeighan/svelte-utils'

# ---------------------------------------------------------------------------

utest.equal 11, svelteSourceCodeEsc('<abc>'), '&lt;abc&gt;'
utest.equal 12, svelteHtmlEsc('{abc}'), '&lbrace;abc&rbrace;'

utest.equal 14, getManifestOptions(), {
	src: "./static/favicon.svg",
	dest: "./static/favicons",
	path: "/favicons"
	appName: "My Great App"
	appShortName: "Great App"
	appDescription: "A great application"
	developerName: 'John Doe'
	version: '1.0.0'
	manifestFileName: 'manifest.json'
	icons:
		android: true
		appleIcon: true
		appleStartup: true
		favicons: true
		windows: false
		yandex: false
	files:
		android: manifestFileName: 'manifest.json'
	}

utest.equal 33, getManifestOptions({developerName: 'John Deighan'}), {
	src: "./static/favicon.svg",
	dest: "./static/favicons",
	path: "/favicons"
	appName: "My Great App"
	appShortName: "Great App"
	appDescription: "A great application"
	developerName: 'John Deighan'
	version: '1.0.0'
	manifestFileName: 'manifest.json'
	icons:
		android: true
		appleIcon: true
		appleStartup: true
		favicons: true
		windows: false
		yandex: false
	files:
		android: manifestFileName: 'manifest.json'
	}

utest.equal 56, getManifestOptions({appName: 'Super App'}), {
	src: "./static/favicon.svg",
	dest: "./static/favicons",
	path: "/favicons"
	appName: "Super App"
	appShortName: "Great App"
	appDescription: "A great application"
	developerName: 'John Doe'
	version: '1.0.0'
	manifestFileName: 'manifest.json'
	icons:
		android: true
		appleIcon: true
		appleStartup: true
		favicons: true
		windows: false
		yandex: false
	files:
		android: manifestFileName: 'manifest.json'
	}
