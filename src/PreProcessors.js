// PreProcessors.coffee
import CoffeeScript from 'coffeescript';

import MagicString from 'magic-string';

import sorcery from 'sorcery';

import {
  undef,
  defined,
  notdefined,
  isEmpty,
  nonEmpty,
  splitPrefix,
  DUMP,
  mapEachLine,
  OL
} from '@jdeighan/base-utils';

import {
  assert
} from '@jdeighan/base-utils/exceptions';

import {
  dbgEnter,
  dbgReturn,
  dbg
} from '@jdeighan/base-utils/debug';

// --- NOTE: the marker must be taken as a comment by CoffeeScript
export var marker = "# |||| $:";

export var jsmarker = marker.replace('#', '//');

// ---------------------------------------------------------------------------
export var coffeePreProcessor = ({content, attributes, filename}) => {
  var code, coffeeCode, coffeeMap, debug, jsCode, lang, postMap, preMap;
  ({lang, debug} = attributes);
  if (!lang) {
    return undef;
  }
  lang = lang.toLowerCase();
  if ((lang !== 'coffee') && (lang !== 'coffeescript')) {
    return undef;
  }
  if (debug) {
    DUMP('original content', content);
  }
  ({
    code: coffeeCode,
    map: preMap
  } = preProc(content));
  if (debug) {
    DUMP('coffeeCode - between preProc & brew', coffeeCode);
  }
  ({
    code: jsCode,
    map: coffeeMap
  } = brew(coffeeCode, {debug}));
  if (debug) {
    DUMP('jsCode - between brew & postProc', jsCode);
  }
  ({
    code,
    map: postMap
  } = postProc(jsCode));
  if (debug) {
    DUMP('code - after postProc', code);
  }
  return {code};
};

// ---------------------------------------------------------------------------
export var preProc = (block) => {
  var code, result;
  dbgEnter('preProc', block);
  code = mapEachLine(block, (line, hInfo) => {
    var blockFollows, indent, isTypeA, isTypeB, lResults, nextIndent, nextStr, stmt, str;
    // --- hInfo has keys lineNum and nextLine
    //     we use nextLine to determine if there are child nodes
    [indent, str] = splitPrefix(line);
    // --- Make sure no input line contains the marker
    assert(str.indexOf(marker) === -1, `line has marker: ${OL(str)}`);
    isTypeA = str.indexOf('$:') === 0;
    isTypeB = str.indexOf('#reactive') === 0;
    if (!isTypeA && !isTypeB) {
      return line;
    }
    // --- We need to know if there's a statement on the line
    if (isTypeA) {
      stmt = str.substring(2).trim();
    } else {
      stmt = str.substring(9).trim();
    }
    // --- We need to know if there are indented lines following
    if (defined(hInfo.nextLine)) {
      [nextIndent, nextStr] = splitPrefix(hInfo.nextLine);
      blockFollows = nextIndent.length > indent.length;
    } else {
      blockFollows = false;
    }
    lResults = [];
    // --- If there is a statement on the line, return
    //        <marker>
    //        <indent><statement>
    if (nonEmpty(stmt)) {
      lResults.push(`${indent}${marker}`);
      lResults.push(`${indent}${stmt}`);
    }
    // --- If there are indented lines following, return
    //        '<indent>if true <marker>'
    if (blockFollows) {
      lResults.push(`${indent}if true ${marker}`);
    }
    if (nonEmpty(lResults)) {
      return lResults.join("\n");
    } else {
      return undef;
    }
  });
  result = {
    code,
    map: undef
  };
  dbgReturn('preProc', result);
  return result;
};

// ---------------------------------------------------------------------------
export var brew = (coffeeCode, hOptions = {}) => {
  var debug, err, result;
  ({debug} = hOptions);
  try {
    result = CoffeeScript.compile(coffeeCode, {
      bare: true,
      header: false,
      sourceMap: true
    });
    if (debug) {
      console.log("brew(): OK");
    }
    return {
      code: result.js,
      map: result.v3SourceMap
    };
  } catch (error) {
    err = error;
    console.log(err);
    throw err;
  }
};

// ---------------------------------------------------------------------------
export var postProc = (content) => {
  var code, reactiveStmtFlag;
  reactiveStmtFlag = false;
  code = mapEachLine(content, (line) => {
    var indent, str;
    [indent, str] = splitPrefix(line);
    if (reactiveStmtFlag) {
      reactiveStmtFlag = false;
      return `${indent}$: ${str}`;
    }
    if (str === jsmarker) {
      reactiveStmtFlag = true;
      return undef;
    } else if (str === `if (true) { ${jsmarker}`) {
      return `${indent}$: {`;
    } else {
      return line;
    }
  });
  return {
    code,
    map: undef
  };
};

// ---------------------------------------------------------------------------
export var i18nPreProcessor = ({content, attributes, filename}) => {
  var replacer, s;
  s = new MagicString(content);
  replacer = (match, str) => {
    str = str.replace(/'/g, "\\'");
    return `{translate('${str}')}`;
  };
  s.replace(/\u25C4(.*?)\u25BA/g, replacer);
  return {
    code: s.toString(),
    map: s.generateMap()
  };
};
