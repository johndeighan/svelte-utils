# language-translator.test.coffee

import {setDebugging} from '@jdeighan/base-utils/debug'
import {
	LanguageTranslator, MSTranslator,
	} from '@jdeighan/svelte-utils/language-translator'
import {equal} from '@jdeighan/base-utils/utest'

# ---------------------------------------------------------------------------

trans = new LanguageTranslator()

str = 'hello'

translated = await trans.translate('hello', 'en', 'zh')
equal translated, 'hello'

translated = await trans.translate('hello', 'en', 'zh')
equal translated, 'hello'
