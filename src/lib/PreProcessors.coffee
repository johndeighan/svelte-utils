# preprocessors.coffee

import MagicString from 'magic-string'

import {
	undef, defined, notdefined, DUMP,
	} from '@jdeighan/base-utils'
import {assert} from '@jdeighan/base-utils/exceptions'
import {
	dbgEnter, dbgReturn, dbg, setDebugging,
	} from '@jdeighan/base-utils/debug'
import {brew} from '@jdeighan/base-utils/coffee'

# ---------------------------------------------------------------------------
# --- As of Svelte 5.0, CoffeeScript preprocessing is no longer needed
# ---------------------------------------------------------------------------

export coffeePreProcessor = ({content, attributes, filename}) =>

	{lang, debug} = attributes

	# --- If not CoffeeScript, just return undef
	if ! lang
		return undef
	lang = lang.toLowerCase()
	if (lang != 'coffee') && (lang != 'coffeescript')
		return undef

	if debug
		DUMP 'CoffeeScript code', content

	[jsCode, map] = brew(content)
	if debug
		DUMP 'JavaScript code', jsCode

	return {code: jsCode, map}

# ---------------------------------------------------------------------------

export i18nPreProcessor = ({content, attributes, filename}) =>

	s = new MagicString(content)

	replacer = (match, str) =>
		str = str.replace(/'/g, "\\'")
		return "{translate('#{str}')}"

	s.replace /\u25C4(.*?)\u25BA/g, replacer

	return {
		code: s.toString()
		map: s.generateMap()
		}
