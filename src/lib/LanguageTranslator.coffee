# LanguageTranslator.coffee

import fetch from 'node-fetch'
import {v4 as uuid} from 'uuid'
import * as dotenv from 'dotenv'
dotenv.config()

import {
	undef, defined, notdefined, pass,
	} from '@jdeighan/base-utils'
import {assert} from '@jdeighan/base-utils/exceptions'
import {dbgEnter, dbgReturn, dbg} from '@jdeighan/base-utils/debug'

# ---------------------------------------------------------------------------

export class LanguageTranslator

	constructor: () ->

		# --- { <from>: <to>: <str>: <translation, ... }
		@hCache = {}

	# ..........................................................

	getFromCache: (str, from, to) ->

		dbgEnter 'getFromCache', str, from, to
		dbg 'cache', @hCache

		if defined(h = @hCache[from]) \
				&& defined(h2 = h[to]) \
				&& defined(result = h2[str])
			dbgReturn 'getFromCache', result
			return result
		else
			dbgReturn 'getFromCache', undef
			return undef

	# ..........................................................

	putIntoCache: (str, from, to, translated) ->

		dbgEnter 'putIntoCache', str, from, to, translated
		if ! @hCache.hasOwnProperty(from)
			@hCache[from] = {}
		h = @hCache[from]
		if ! h.hasOwnProperty(to)
			h[to] = {}
		h = h[to]
		assert ! h.hasOwnProperty(str)
		h[str] = translated
		dbgReturn 'putIntoCache'
		return

	# ..........................................................

	translate: (str, from, to) ->

		dbgEnter 'translate', str, from, to
		if translated = @getFromCache(str, from, to)
			dbg "found previous translation"
			dbgReturn 'translate', translated
			return translated
		translated = await @translateStr(str, from, to)
		@putIntoCache str, from, to, translated
		dbgReturn 'translate', translated
		return translated

	# ..........................................................

	translateStr: (str, from, to) ->

		return str

# ---------------------------------------------------------------------------

export class MSTranslator extends LanguageTranslator

	constructor: () ->

		super()
		@baseURL = process.env['TRANSLATE_URL']
		@key = process.env['TRANSLATE_KEY']
		@location = process.env['TRANSLATE_LOCATION']

	# ..........................................................

	translateStr: (str, from, to) ->

		# --- construct the URL
		url = new URL(@baseURL)
		url.searchParams.set('api-version', '3.0')
		url.searchParams.set('from', from)
		url.searchParams.set('to', to)

		body = [{text: str}]
		resp = await fetch url, {
			method: 'post',
			headers: {
				'Ocp-Apim-Subscription-Key': @key,
				'Ocp-Apim-Subscription-Region': @location,
				'Content-type': 'application/json',
				'X-ClientTraceId': uuid().toString()
				},
			body: JSON.stringify(body)
			}
		data = await resp.json()
		return data[0].translations[0].text
