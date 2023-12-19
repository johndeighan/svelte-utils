Svelte Utils
============

This package includes the following libraries:

`@jdeighan/preprocessors`
------------------

A function named `coffeePreProcessor` that can be
used to enable `<script>` blocks in Svelte code
containing CoffeeScript code using `lang="coffee"` as
the `<script>` attribute.

`@jdeighan/translator`
------------------

A class named `MSTranslator` that uses the Microsoft
language translator (you must set environment variables
TRANSLATE_URL, TRANSLATE_KEY AND TRANSLATE_LOCATION to
use it). It has method translateStr(str, from, to) where
str is the string to translate and from/to are language
codes. If you translate the same string a second time,
it will fetch the translation from a cache rather then
use the Microsoft service.

`@jdeighan/stores`
------------------

Some utility Svelte data stores
