# svelte-utils.coffee

import favicons from 'favicons'
import fs from 'fs/promises'
import pathLib from 'path'
import {
	mkpath, fileExt, isDir, mkdirSync, barf,
	} from '@jdeighan/coffee-utils/fs'

import {isFunction, getOptions} from '@jdeighan/base-utils'
import {assert, croak} from '@jdeighan/base-utils/exceptions'
import {LOG} from '@jdeighan/base-utils/log'

# ---------------------------------------------------------------------------
#   svelteSourceCodeEsc - to display source code for a *.starbucks page

export svelteSourceCodeEsc = (str) =>

	return str \
		.replace(/\</g, '&lt;') \
		.replace(/\>/g, '&gt;') \
		.replace(/\{/g, '&lbrace;') \
		.replace(/\}/g, '&rbrace;') \
		.replace(/\$/g, '&dollar;')

# ---------------------------------------------------------------------------
#   svelteHtmlEsc - after converting markdown

export svelteHtmlEsc = (str) =>

	return str \
		.replace(/\{/g, '&lbrace;') \
		.replace(/\}/g, '&rbrace;') \
		.replace(/\$/g, '&dollar;')

# ---------------------------------------------------------------------------
# --- export only to allow unit tests

export getFaviconOptions = (hOptions={}) =>

	# --- These are defaults - all can be overridden
	hDefaultOptions = {
		src: "./static/favicon.svg",
		dest: "./static/favicons",
		path: "/favicons"
		appName: "My Great App"
		appShortName: "Great App"
		appDescription: "A great application"
		developerName: 'John Doe'
		version: '1.0.0'
		manifestFileName: 'manifest.json'
		}
	hOptions = getOptions(hOptions, hDefaultOptions)
	return {
		src: hOptions.src
		dest: hOptions.dest
		path: hOptions.path
		appName: hOptions.appName
		appShortName: hOptions.appShortName
		appDescription: hOptions.appDescription
		developerName: hOptions.developerName
		version: hOptions.version
		manifestFileName: hOptions.manifestFileName
		icons: {
			android: true
			appleIcon: true
			appleStartup: true
			favicons: true
			windows: false
			yandex: false
			}
		files: {
			android: {
				manifestFileName: 'manifest.json'
				}
			}
		}

# ---------------------------------------------------------------------------

export genFavicons = (hOptions={}) =>

	hOptions = getFaviconOptions(hOptions)
	{dest, src} = hOptions

	# --- Create destination folder if it doesn't exist
	if ! isDir dest
		mkdirSync dest

	assert (fileExt(src).toLowerCase() == '.svg'), "Source not an SVG file"
	{images, files, html} = await favicons(src, hOptions)

	images.map (image) => barf(mkpath(dest, image.name), image.contents)
	files.map (file) => barf(mkpath(dest, file.name), file.contents)
	barf mkpath(dest, 'icons.html'), html.join("\n")

# ---------------------------------------------------------------------------

export onInterval = (func, secs, doLog=false) =>

	assert isFunction(func), "onInterval(): 1st arg not a function"
	ms = Math.floor(1000 * secs)
	if doLog
		LOG "calling func every #{ms} ms."
	interval = setInterval(func, ms)

	return () ->
		if doLog
			LOG "destroying interval timer"
		clearInterval interval
