(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Compile with --optimize  for better performance and smaller assets.');

// EQUALITY

function _Utils_eq(x, y) {
  for (
    var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
    isEqual && (pair = stack.pop());
    isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
  ) {}

  return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack) {
  if (x === y) {
    return true;
  }

  if (typeof x !== "object" || x === null || y === null) {
    typeof x === "function" && _Debug_crash(5);
    return false;
  }

  if (depth > 100) {
    stack.push({ a: x, b: y });
    return true;
  }

  /**/
	if (x.$ === 'Set_gren_builtin')
	{
		x = $gren_lang$core$Set$toArray(x);
		y = $gren_lang$core$Set$toArray(y);
	}
	if (x.$ === 'RBNode_gren_builtin' || x.$ === 'RBEmpty_gren_builtin')
	{
		x = $gren_lang$core$Dict$toArray(x);
		y = $gren_lang$core$Dict$toArray(y);
	}
	//*/

  /**_UNUSED/
	if (x.$ < 0)
	{
		x = $gren_lang$core$Dict$toArray(x);
		y = $gren_lang$core$Dict$toArray(y);
	}
	//*/

  if (Array.isArray(x) && x.length !== y.length) {
    return false;
  }

  var nextDepth = depth + 1;

  for (var key in x) {
    if (!_Utils_eqHelp(x[key], y[key], nextDepth, stack)) {
      return false;
    }
  }

  return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function (a, b) {
  return !_Utils_eq(a, b);
});

// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y) {
  if (typeof x !== "object") {
    return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
  }

  /**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

  // At this point, we can only be comparing arrays
  for (var idx = 0; idx < x.length; idx++) {
    var ord = _Utils_cmp(x[idx], y[idx]);
    if (ord !== 0) return ord;
  }

  return x.length - y.length;
}

var _Utils_lt = F2(function (a, b) {
  return _Utils_cmp(a, b) < 0;
});
var _Utils_le = F2(function (a, b) {
  return _Utils_cmp(a, b) < 1;
});
var _Utils_gt = F2(function (a, b) {
  return _Utils_cmp(a, b) > 0;
});
var _Utils_ge = F2(function (a, b) {
  return _Utils_cmp(a, b) >= 0;
});

var _Utils_compare = F2(function (x, y) {
  var n = _Utils_cmp(x, y);
  return n < 0 ? $gren_lang$core$Basics$LT : n ? $gren_lang$core$Basics$GT : $gren_lang$core$Basics$EQ;
});

// COMMON VALUES

function _Utils_chr_UNUSED(c) {
  return c;
}
function _Utils_chr(c) {
  return new String(c);
}

// RECORDS

function _Utils_update(oldRecord, updatedFields) {
  var newRecord = {};

  for (var key in oldRecord) {
    newRecord[key] = oldRecord[key];
  }

  for (var key in updatedFields) {
    newRecord[key] = updatedFields[key];
  }

  return newRecord;
}

// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys) {
  // append Strings
  if (typeof xs === "string") {
    return xs + ys;
  }

  return xs.concat(ys);
}


var _Array_length = function (array) {
  return array.length;
};

var _Array_initialize = F3(function (size, offset, func) {
  var result = new Array(size);

  for (var i = 0; i < size; i++) {
    result[i] = func(offset + i);
  }

  return result;
});

var _Array_get = F2(function (index, array) {
  if (index < 0 || index >= array.length) {
    return $gren_lang$core$Maybe$Nothing;
  }

  return $gren_lang$core$Maybe$Just(array[index]);
});

var _Array_set = F3(function (index, value, array) {
  if (index < 0 || index >= array.length) {
    return array;
  }

  var result = array.slice();
  result[index] = value;

  return result;
});

var _Array_push = F2(function (value, array) {
  return array.concat([value]);
});

var _Array_foldl = F3(function (func, acc, array) {
  for (var i = 0; i < array.length; i++) {
    acc = A2(func, array[i], acc);
  }

  return acc;
});

var _Array_foldr = F3(function (func, acc, array) {
  for (var i = array.length - 1; i >= 0; i--) {
    acc = A2(func, array[i], acc);
  }

  return acc;
});

var _Array_map = F2(function (func, array) {
  return array.map(func);
});

var _Array_indexedMap = F2(function (func, array) {
  return array.map(function (value, index) {
    return A2(func, index, value);
  });
});

var _Array_slice = F3(function (from, to, array) {
  return array.slice(from, to);
});

var _Array_append = F2(function (left, right) {
  return left.concat(right);
});

var _Array_reverse = function (array) {
  return array.slice().reverse();
};

var _Array_findFirst = F2(function (pred, array) {
  for (var i = 0; i < array.length; i++) {
    var element = array[i];

    if (pred(element)) {
      return $gren_lang$core$Maybe$Just(element);
    }
  }

  return $gren_lang$core$Maybe$Nothing;
});

var _Array_findLast = F2(function (pred, array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var element = array[i];

    if (pred(element)) {
      return $gren_lang$core$Maybe$Just(element);
    }
  }

  return $gren_lang$core$Maybe$Nothing;
});

var _Array_map2 = F3(function (fn, as, bs) {
  var result = [];
  var lowestLength = as.length < bs.length ? as.length : bs.length;

  for (var i = 0; i < lowestLength; i++) {
    result.push(A2(fn, as[i], bs[i]));
  }

  return result;
});

var _Array_map3 = F4(function (fn, as, bs, cs) {
  var result = [];
  var lowestLength = [as.length, bs.length, cs.length].sort()[0];

  for (var i = 0; i < lowestLength; i++) {
    result.push(A3(fn, as[i], bs[i], cs[i]));
  }

  return result;
});

var _Array_sort = function (array) {
  return array.slice().sort(function (a, b) {
    return _Utils_cmp(a, b);
  });
};

var _Array_sortBy = F2(function (fn, array) {
  return array.slice().sort(function (a, b) {
    return _Utils_cmp(fn(a), fn(b));
  });
});

var _Array_sortWith = F2(function (fn, array) {
  return array.slice().sort(function (a, b) {
    var ord = A2(fn, a, b);
    return ord === $gren_lang$core$Basics$EQ ? 0 : ord === $gren_lang$core$Basics$LT ? -1 : 1;
  });
});


// LOG

var _Debug_log_UNUSED = F2(function (tag, value) {
  return value;
});

var _Debug_log = F2(function (tag, value) {
  console.log(tag + ": " + _Debug_toString(value));
  return value;
});

// TODOS

function _Debug_todo(moduleName, region) {
  return function (message) {
    _Debug_crash(8, moduleName, region, message);
  };
}

function _Debug_todoCase(moduleName, region, value) {
  return function (message) {
    _Debug_crash(9, moduleName, region, value, message);
  };
}

// TO STRING

function _Debug_toString_UNUSED(value) {
  return "<internals>";
}

function _Debug_toString(value) {
  return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value) {
  if (value == null) {
    return _Debug_internalColor(ansi, "<null>");
  }

  if (typeof value === "function") {
    return _Debug_internalColor(ansi, "<function>");
  }

  if (typeof value === "boolean") {
    return _Debug_ctorColor(ansi, value ? "True" : "False");
  }

  if (typeof value === "number") {
    return _Debug_numberColor(ansi, value + "");
  }

  if (value instanceof String) {
    return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
  }

  if (typeof value === "string") {
    return _Debug_stringColor(
      ansi,
      '"' + _Debug_addSlashes(value, false) + '"'
    );
  }

  if (Array.isArray(value)) {
    var output = "[";

    value.length > 0 && (output += _Debug_toAnsiString(ansi, value[0]));

    for (var idx = 1; idx < value.length; idx++) {
      output += ", " + _Debug_toAnsiString(ansi, value[idx]);
    }

    return output + "]";
  }

  if (typeof value === "object" && "$" in value) {
    var tag = value.$;

    if (typeof tag === "number") {
      return _Debug_internalColor(ansi, "<internals>");
    }

    if (tag === "Set_gren_builtin") {
      return (
        _Debug_ctorColor(ansi, "Set") +
        _Debug_fadeColor(ansi, ".fromArray") +
        " " +
        _Debug_toAnsiString(ansi, $gren_lang$core$Set$toArray(value))
      );
    }

    if (tag === "RBNode_gren_builtin" || tag === "RBEmpty_gren_builtin") {
      return (
        _Debug_ctorColor(ansi, "Dict") +
        _Debug_fadeColor(ansi, ".fromArray") +
        " " +
        _Debug_toAnsiString(ansi, $gren_lang$core$Dict$toArray(value))
      );
    }

    var output = "";
    for (var i in value) {
      if (i === "$") continue;
      var str = _Debug_toAnsiString(ansi, value[i]);
      var c0 = str[0];
      var parenless =
        c0 === "{" ||
        c0 === "(" ||
        c0 === "[" ||
        c0 === "<" ||
        c0 === '"' ||
        str.indexOf(" ") < 0;
      output += " " + (parenless ? str : "(" + str + ")");
    }
    return _Debug_ctorColor(ansi, tag) + output;
  }

  if (typeof DataView === "function" && value instanceof DataView) {
    return _Debug_stringColor(ansi, "<" + value.byteLength + " bytes>");
  }

  if (typeof File !== "undefined" && value instanceof File) {
    return _Debug_internalColor(ansi, "<" + value.name + ">");
  }

  if (typeof value === "object") {
    var output = [];
    for (var key in value) {
      var field = key[0] === "_" ? key.slice(1) : key;
      output.push(
        _Debug_fadeColor(ansi, field) +
          " = " +
          _Debug_toAnsiString(ansi, value[key])
      );
    }
    if (output.length === 0) {
      return "{}";
    }
    return "{ " + output.join(", ") + " }";
  }

  return _Debug_internalColor(ansi, "<internals>");
}

function _Debug_addSlashes(str, isChar) {
  var s = str
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replace(/\r/g, "\\r")
    .replace(/\v/g, "\\v")
    .replace(/\0/g, "\\0");

  if (isChar) {
    return s.replace(/\'/g, "\\'");
  } else {
    return s.replace(/\"/g, '\\"');
  }
}

function _Debug_ctorColor(ansi, string) {
  return ansi ? "\x1b[96m" + string + "\x1b[0m" : string;
}

function _Debug_numberColor(ansi, string) {
  return ansi ? "\x1b[95m" + string + "\x1b[0m" : string;
}

function _Debug_stringColor(ansi, string) {
  return ansi ? "\x1b[93m" + string + "\x1b[0m" : string;
}

function _Debug_charColor(ansi, string) {
  return ansi ? "\x1b[92m" + string + "\x1b[0m" : string;
}

function _Debug_fadeColor(ansi, string) {
  return ansi ? "\x1b[37m" + string + "\x1b[0m" : string;
}

function _Debug_internalColor(ansi, string) {
  return ansi ? "\x1b[36m" + string + "\x1b[0m" : string;
}

function _Debug_toHexDigit(n) {
  return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}

// CRASH

function _Debug_crash_UNUSED(identifier) {
  throw new Error(
    "https://github.com/gren-lang/core/blob/1.0.0/hints/" + identifier + ".md"
  );
}

function _Debug_crash(identifier, fact1, fact2, fact3, fact4) {
  switch (identifier) {
    case 0:
      throw new Error(
        'What node should I take over? In JavaScript I need something like:\n\n    Gren.Main.init({\n        node: document.getElementById("gren-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.'
      );

    case 1:
      throw new Error(
        "Browser.application programs cannot handle URLs like this:\n\n    " +
          document.location.href +
          "\n\nWhat is the root? The root of your file system?"
      );

    case 2:
      var jsonErrorString = fact1;
      throw new Error(
        "Problem with the flags given to your Gren program on initialization.\n\n" +
          jsonErrorString
      );

    case 3:
      var portName = fact1;
      throw new Error(
        "There can only be one port named `" +
          portName +
          "`, but your program has multiple."
      );

    case 4:
      var portName = fact1;
      var problem = fact2;
      throw new Error(
        "Trying to send an unexpected type of value through port `" +
          portName +
          "`:\n" +
          problem
      );

    case 5:
      throw new Error(
        'Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Gren sense.\nRead more about this at https://package.gren-lang.org/packages/gren-lang/core/latest/Basics#== which describes why it is this way and what the better version will look like.'
      );

    case 6:
      var moduleName = fact1;
      throw new Error(
        "Your page is loading multiple Gren scripts with a module named " +
          moduleName +
          ". Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!"
      );

    case 8:
      var moduleName = fact1;
      var region = fact2;
      var message = fact3;
      throw new Error(
        "TODO in module `" +
          moduleName +
          "` " +
          _Debug_regionToString(region) +
          "\n\n" +
          message
      );

    case 9:
      var moduleName = fact1;
      var region = fact2;
      var value = fact3;
      var message = fact4;
      throw new Error(
        "TODO in module `" +
          moduleName +
          "` from the `case` expression " +
          _Debug_regionToString(region) +
          "\n\nIt received the following value:\n\n    " +
          _Debug_toString(value).replace("\n", "\n    ") +
          "\n\nBut the branch that handles it says:\n\n    " +
          message.replace("\n", "\n    ")
      );

    case 10:
      throw new Error("Bug in https://github.com/gren-lang/core/issues");

    case 11:
      throw new Error("Cannot perform mod 0. Division by zero error.");
  }
}

function _Debug_regionToString(region) {
  if (region.start.line === region.end.line) {
    return "on line " + region.start.line;
  }
  return (
    "on lines " + region.start.line + " through " + region.end.line
  );
}


// MATH

var _Basics_add = F2(function (a, b) {
  return a + b;
});
var _Basics_sub = F2(function (a, b) {
  return a - b;
});
var _Basics_mul = F2(function (a, b) {
  return a * b;
});
var _Basics_fdiv = F2(function (a, b) {
  return a / b;
});
var _Basics_idiv = F2(function (a, b) {
  return (a / b) | 0;
});
var _Basics_pow = F2(Math.pow);

// MORE MATH

function _Basics_toFloat(x) {
  return x;
}
function _Basics_isInfinite(n) {
  return n === Infinity || n === -Infinity;
}

var _Basics_isNaN = isNaN;

// BOOLEANS

function _Basics_not(bool) {
  return !bool;
}
var _Basics_and = F2(function (a, b) {
  return a && b;
});
var _Basics_or = F2(function (a, b) {
  return a || b;
});
var _Basics_xor = F2(function (a, b) {
  return a !== b;
});


var _String_cons = F2(function (chr, str) {
  return chr + str;
});

function _String_uncons(string) {
  var word = string.charCodeAt(0);
  return !isNaN(word)
    ? $gren_lang$core$Maybe$Just(
        0xd800 <= word && word <= 0xdbff
          ? { first: _Utils_chr(string[0] + string[1]), rest: string.slice(2) }
          : { first: _Utils_chr(string[0]), rest: string.slice(1) }
      )
    : $gren_lang$core$Maybe$Nothing;
}

var _String_append = F2(function (a, b) {
  return a + b;
});

function _String_length(str) {
  return str.length;
}

var _String_map = F2(function (func, string) {
  var len = string.length;
  var array = new Array(len);
  var i = 0;
  while (i < len) {
    var word = string.charCodeAt(i);
    if (0xd800 <= word && word <= 0xdbff) {
      array[i] = func(_Utils_chr(string[i] + string[i + 1]));
      i += 2;
      continue;
    }
    array[i] = func(_Utils_chr(string[i]));
    i++;
  }
  return array.join("");
});

var _String_filter = F2(function (isGood, str) {
  var arr = [];
  var len = str.length;
  var i = 0;
  while (i < len) {
    var char = str[i];
    var word = str.charCodeAt(i);
    i++;
    if (0xd800 <= word && word <= 0xdbff) {
      char += str[i];
      i++;
    }

    if (isGood(_Utils_chr(char))) {
      arr.push(char);
    }
  }
  return arr.join("");
});

function _String_reverse(str) {
  var len = str.length;
  var arr = new Array(len);
  var i = 0;
  while (i < len) {
    var word = str.charCodeAt(i);
    if (0xd800 <= word && word <= 0xdbff) {
      arr[len - i] = str[i + 1];
      i++;
      arr[len - i] = str[i - 1];
      i++;
    } else {
      arr[len - i] = str[i];
      i++;
    }
  }
  return arr.join("");
}

var _String_foldl = F3(function (func, state, string) {
  var len = string.length;
  var i = 0;
  while (i < len) {
    var char = string[i];
    var word = string.charCodeAt(i);
    i++;
    if (0xd800 <= word && word <= 0xdbff) {
      char += string[i];
      i++;
    }
    state = A2(func, _Utils_chr(char), state);
  }
  return state;
});

var _String_foldr = F3(function (func, state, string) {
  var i = string.length;
  while (i--) {
    var char = string[i];
    var word = string.charCodeAt(i);
    if (0xdc00 <= word && word <= 0xdfff) {
      i--;
      char = string[i] + char;
    }
    state = A2(func, _Utils_chr(char), state);
  }
  return state;
});

var _String_split = F2(function (sep, str) {
  return str.split(sep);
});

var _String_join = F2(function (sep, strs) {
  return strs.join(sep);
});

var _String_slice = F3(function (start, end, str) {
  return str.slice(start, end);
});

function _String_trim(str) {
  return str.trim();
}

function _String_trimLeft(str) {
  return str.replace(/^\s+/, "");
}

function _String_trimRight(str) {
  return str.replace(/\s+$/, "");
}

function _String_words(str) {
  return str.trim().split(/\s+/g);
}

function _String_lines(str) {
  return str.split(/\r\n|\r|\n/g);
}

function _String_toUpper(str) {
  return str.toUpperCase();
}

function _String_toLower(str) {
  return str.toLowerCase();
}

var _String_any = F2(function (isGood, string) {
  var i = string.length;
  while (i--) {
    var char = string[i];
    var word = string.charCodeAt(i);
    if (0xdc00 <= word && word <= 0xdfff) {
      i--;
      char = string[i] + char;
    }
    if (isGood(_Utils_chr(char))) {
      return true;
    }
  }
  return false;
});

var _String_all = F2(function (isGood, string) {
  var i = string.length;
  while (i--) {
    var char = string[i];
    var word = string.charCodeAt(i);
    if (0xdc00 <= word && word <= 0xdfff) {
      i--;
      char = string[i] + char;
    }
    if (!isGood(_Utils_chr(char))) {
      return false;
    }
  }
  return true;
});

var _String_contains = F2(function (sub, str) {
  return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function (sub, str) {
  return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function (sub, str) {
  return (
    str.length >= sub.length && str.lastIndexOf(sub) === str.length - sub.length
  );
});

var _String_indexes = F2(function (sub, str) {
  var subLen = sub.length;

  if (subLen < 1) {
    return [];
  }

  var i = 0;
  var is = [];

  while ((i = str.indexOf(sub, i)) > -1) {
    is.push(i);
    i = i + subLen;
  }

  return is;
});

// TO STRING

function _String_fromNumber(number) {
  return number + "";
}

// INT CONVERSIONS

function _String_toInt(str) {
  var total = 0;
  var code0 = str.charCodeAt(0);
  var start = code0 == 0x2b /* + */ || code0 == 0x2d /* - */ ? 1 : 0;

  for (var i = start; i < str.length; ++i) {
    var code = str.charCodeAt(i);
    if (code < 0x30 || 0x39 < code) {
      return $gren_lang$core$Maybe$Nothing;
    }
    total = 10 * total + code - 0x30;
  }

  return i == start
    ? $gren_lang$core$Maybe$Nothing
    : $gren_lang$core$Maybe$Just(code0 == 0x2d ? -total : total);
}

// FLOAT CONVERSIONS

function _String_toFloat(s) {
  // check if it is a hex, octal, or binary number
  if (s.length === 0 || /[\sxbo]/.test(s)) {
    return $gren_lang$core$Maybe$Nothing;
  }
  var n = +s;
  // faster isNaN check
  return n === n ? $gren_lang$core$Maybe$Just(n) : $gren_lang$core$Maybe$Nothing;
}

function _String_fromArray(chars) {
  return chars.join("");
}


function _Char_toCode(char) {
  var code = char.charCodeAt(0);
  if (0xd800 <= code && code <= 0xdbff) {
    return (code - 0xd800) * 0x400 + char.charCodeAt(1) - 0xdc00 + 0x10000;
  }
  return code;
}

function _Char_fromCode(code) {
  return _Utils_chr(
    code < 0 || 0x10ffff < code
      ? "\uFFFD"
      : code <= 0xffff
      ? String.fromCharCode(code)
      : ((code -= 0x10000),
        String.fromCharCode(
          Math.floor(code / 0x400) + 0xd800,
          (code % 0x400) + 0xdc00
        ))
  );
}

function _Char_toUpper(char) {
  return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char) {
  return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char) {
  return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char) {
  return _Utils_chr(char.toLocaleLowerCase());
}


/**/
function _Json_errorToString(error)
{
	return $gren_lang$core$Json$Decode$errorToString(error);
}
//*/

// CORE DECODERS

function _Json_succeed(msg) {
  return {
    $: 0,
    a: msg,
  };
}

function _Json_fail(msg) {
  return {
    $: 1,
    a: msg,
  };
}

function _Json_decodePrim(decoder) {
  return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function (value) {
  return typeof value !== "number"
    ? _Json_expecting("an INT", value)
    : -2147483647 < value && value < 2147483647 && (value | 0) === value
    ? $gren_lang$core$Result$Ok(value)
    : isFinite(value) && !(value % 1)
    ? $gren_lang$core$Result$Ok(value)
    : _Json_expecting("an INT", value);
});

var _Json_decodeBool = _Json_decodePrim(function (value) {
  return typeof value === "boolean"
    ? $gren_lang$core$Result$Ok(value)
    : _Json_expecting("a BOOL", value);
});

var _Json_decodeFloat = _Json_decodePrim(function (value) {
  return typeof value === "number"
    ? $gren_lang$core$Result$Ok(value)
    : _Json_expecting("a FLOAT", value);
});

var _Json_decodeValue = _Json_decodePrim(function (value) {
  return $gren_lang$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function (value) {
  return typeof value === "string"
    ? $gren_lang$core$Result$Ok(value)
    : value instanceof String
    ? $gren_lang$core$Result$Ok(value + "")
    : _Json_expecting("a STRING", value);
});

function _Json_decodeArray(decoder) {
  return { $: 3, b: decoder };
}

function _Json_decodeNull(value) {
  return { $: 4, c: value };
}

var _Json_decodeField = F2(function (field, decoder) {
  return {
    $: 5,
    d: field,
    b: decoder,
  };
});

var _Json_decodeIndex = F2(function (index, decoder) {
  return {
    $: 6,
    e: index,
    b: decoder,
  };
});

function _Json_decodeKeyValuePairs(decoder) {
  return {
    $: 7,
    b: decoder,
  };
}

function _Json_mapMany(f, decoders) {
  return {
    $: 8,
    f: f,
    g: decoders,
  };
}

var _Json_andThen = F2(function (callback, decoder) {
  return {
    $: 9,
    b: decoder,
    h: callback,
  };
});

function _Json_oneOf(decoders) {
  return {
    $: 10,
    g: decoders,
  };
}

// DECODING OBJECTS

var _Json_map1 = F2(function (f, d1) {
  return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function (f, d1, d2) {
  return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function (f, d1, d2, d3) {
  return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function (f, d1, d2, d3, d4) {
  return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function (f, d1, d2, d3, d4, d5) {
  return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function (f, d1, d2, d3, d4, d5, d6) {
  return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function (f, d1, d2, d3, d4, d5, d6, d7) {
  return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function (f, d1, d2, d3, d4, d5, d6, d7, d8) {
  return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});

// DECODE

var _Json_runOnString = F2(function (decoder, string) {
  try {
    var value = JSON.parse(string);
    return _Json_runHelp(decoder, value);
  } catch (e) {
    return $gren_lang$core$Result$Err(
      A2(
        $gren_lang$core$Json$Decode$Failure,
        "This is not valid JSON! " + e.message,
        _Json_wrap(string)
      )
    );
  }
});

var _Json_run = F2(function (decoder, value) {
  return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value) {
  switch (decoder.$) {
    case 2:
      return decoder.b(value);

    case 4:
      return value === null
        ? $gren_lang$core$Result$Ok(decoder.c)
        : _Json_expecting("null", value);

    case 3:
      if (!_Json_isArray(value)) {
        return _Json_expecting("an ARRAY", value);
      }
      return _Json_runArrayDecoder(decoder.b, value);

    case 5:
      var field = decoder.d;
      if (typeof value !== "object" || value === null || !(field in value)) {
        return _Json_expecting(
          "an OBJECT with a field named `" + field + "`",
          value
        );
      }
      var result = _Json_runHelp(decoder.b, value[field]);
      return $gren_lang$core$Result$isOk(result)
        ? result
        : $gren_lang$core$Result$Err(A2($gren_lang$core$Json$Decode$Field, field, result.a));

    case 6:
      var index = decoder.e;
      if (!_Json_isArray(value)) {
        return _Json_expecting("an ARRAY", value);
      }
      if (index >= value.length) {
        return _Json_expecting(
          "a LONGER array. Need index " +
            index +
            " but only see " +
            value.length +
            " entries",
          value
        );
      }
      var result = _Json_runHelp(decoder.b, value[index]);
      return $gren_lang$core$Result$isOk(result)
        ? result
        : $gren_lang$core$Result$Err(A2($gren_lang$core$Json$Decode$Index, index, result.a));

    case 7:
      if (typeof value !== "object" || value === null || _Json_isArray(value)) {
        return _Json_expecting("an OBJECT", value);
      }

      var keyValuePairs = [];
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          var result = _Json_runHelp(decoder.b, value[key]);
          if (!$gren_lang$core$Result$isOk(result)) {
            return $gren_lang$core$Result$Err(A2($gren_lang$core$Json$Decode$Field, key, result.a));
          }
          keyValuePairs.push({ key: key, value: result.a });
        }
      }
      return $gren_lang$core$Result$Ok(keyValuePairs);

    case 8:
      var answer = decoder.f;
      var decoders = decoder.g;
      for (var i = 0; i < decoders.length; i++) {
        var result = _Json_runHelp(decoders[i], value);
        if (!$gren_lang$core$Result$isOk(result)) {
          return result;
        }
        answer = answer(result.a);
      }
      return $gren_lang$core$Result$Ok(answer);

    case 9:
      var result = _Json_runHelp(decoder.b, value);
      return !$gren_lang$core$Result$isOk(result)
        ? result
        : _Json_runHelp(decoder.h(result.a), value);

    case 10:
      var errors = [];

      var decoders = decoder.g;
      for (var idx = 0; idx < decoders.length; idx++) {
        var result = _Json_runHelp(decoders[idx], value);
        if ($gren_lang$core$Result$isOk(result)) {
          return result;
        }
        errors.push(result.a);
      }

      return $gren_lang$core$Result$Err($gren_lang$core$Json$Decode$OneOf(errors));

    case 1:
      return $gren_lang$core$Result$Err(A2($gren_lang$core$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

    case 0:
      return $gren_lang$core$Result$Ok(decoder.a);
  }
}

function _Json_runArrayDecoder(decoder, value) {
  var len = value.length;
  var array = new Array(len);
  for (var i = 0; i < len; i++) {
    var result = _Json_runHelp(decoder, value[i]);
    if (!$gren_lang$core$Result$isOk(result)) {
      return $gren_lang$core$Result$Err(A2($gren_lang$core$Json$Decode$Index, i, result.a));
    }
    array[i] = result.a;
  }
  return $gren_lang$core$Result$Ok(array);
}

function _Json_isArray(value) {
  return (
    Array.isArray(value) ||
    (typeof FileList !== "undefined" && value instanceof FileList)
  );
}

function _Json_expecting(type, value) {
  return $gren_lang$core$Result$Err(
    A2($gren_lang$core$Json$Decode$Failure, "Expecting " + type, _Json_wrap(value))
  );
}

// EQUALITY

function _Json_equality(x, y) {
  if (x === y) {
    return true;
  }

  if (x.$ !== y.$) {
    return false;
  }

  switch (x.$) {
    case 0:
    case 1:
      return x.a === y.a;

    case 2:
      return x.b === y.b;

    case 4:
      return x.c === y.c;

    case 3:
    case 7:
      return _Json_equality(x.b, y.b);

    case 5:
      return (
        x.d === y.d && _Json_equality(x.b, y.b)
      );

    case 6:
      return (
        x.e === y.e && _Json_equality(x.b, y.b)
      );

    case 8:
      return (
        x.f === y.f && _Json_arrayEquality(x.g, y.g)
      );

    case 9:
      return (
        x.h === y.h &&
        _Json_equality(x.b, y.b)
      );

    case 10:
      return _Json_arrayEquality(x.g, y.g);
  }
}

function _Json_arrayEquality(aDecoders, bDecoders) {
  var len = aDecoders.length;
  if (len !== bDecoders.length) {
    return false;
  }
  for (var i = 0; i < len; i++) {
    if (!_Json_equality(aDecoders[i], bDecoders[i])) {
      return false;
    }
  }
  return true;
}

// ENCODE

var _Json_encode = F2(function (indentLevel, value) {
  return JSON.stringify(_Json_unwrap(value), null, indentLevel) + "";
});

function _Json_wrap(value) {
  return { $: 0, a: value };
}
function _Json_unwrap(value) {
  return value.a;
}

function _Json_wrap_UNUSED(value) {
  return value;
}
function _Json_unwrap_UNUSED(value) {
  return value;
}

function _Json_emptyArray() {
  return [];
}
function _Json_emptyObject() {
  return {};
}

var _Json_addField = F3(function (key, value, object) {
  object[key] = _Json_unwrap(value);
  return object;
});

function _Json_addEntry(func) {
  return F2(function (entry, array) {
    array.push(_Json_unwrap(func(entry)));
    return array;
  });
}

var _Json_encodeNull = _Json_wrap(null);


// TASKS

function _Scheduler_succeed(value) {
  return {
    $: 0,
    a: value,
  };
}

function _Scheduler_fail(error) {
  return {
    $: 1,
    a: error,
  };
}

function _Scheduler_binding(callback) {
  return {
    $: 2,
    b: callback,
    c: null,
  };
}

var _Scheduler_andThen = F2(function (callback, task) {
  return {
    $: 3,
    b: callback,
    d: task,
  };
});

var _Scheduler_onError = F2(function (callback, task) {
  return {
    $: 4,
    b: callback,
    d: task,
  };
});

function _Scheduler_receive(callback) {
  return {
    $: 5,
    b: callback,
  };
}

// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task) {
  var proc = {
    $: 0,
    e: _Scheduler_guid++,
    f: task,
    g: null,
    h: [],
  };

  _Scheduler_enqueue(proc);

  return proc;
}

function _Scheduler_spawn(task) {
  return _Scheduler_binding(function (callback) {
    callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
  });
}

function _Scheduler_rawSend(proc, msg) {
  proc.h.push(msg);
  _Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function (proc, msg) {
  return _Scheduler_binding(function (callback) {
    _Scheduler_rawSend(proc, msg);
    callback(_Scheduler_succeed({}));
  });
});

function _Scheduler_kill(proc) {
  return _Scheduler_binding(function (callback) {
    var task = proc.f;
    if (task && task.$ === 2 && task.c) {
      task.c();
    }

    proc.f = null;

    callback(_Scheduler_succeed({}));
  });
}

/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/

var _Scheduler_working = false;
var _Scheduler_queue = [];

function _Scheduler_enqueue(proc) {
  _Scheduler_queue.push(proc);
  if (_Scheduler_working) {
    return;
  }
  _Scheduler_working = true;
  while ((proc = _Scheduler_queue.shift())) {
    _Scheduler_step(proc);
  }
  _Scheduler_working = false;
}

function _Scheduler_step(proc) {
  while (proc.f) {
    var rootTag = proc.f.$;
    if (rootTag === 0 || rootTag === 1) {
      while (proc.g && proc.g.$ !== rootTag) {
        proc.g = proc.g.i;
      }
      if (!proc.g) {
        return;
      }
      proc.f = proc.g.b(proc.f.a);
      proc.g = proc.g.i;
    } else if (rootTag === 2) {
      proc.f.c = proc.f.b(function (newRoot) {
        proc.f = newRoot;
        _Scheduler_enqueue(proc);
      });
      return;
    } else if (rootTag === 5) {
      if (proc.h.length === 0) {
        return;
      }
      proc.f = proc.f.b(proc.h.shift());
    } // if (rootTag === 3 || rootTag === 4)
    else {
      proc.g = {
        $: rootTag === 3 ? 0 : 1,
        b: proc.f.b,
        i: proc.g,
      };
      proc.f = proc.f.d;
    }
  }
}


function _Process_sleep(time) {
  return _Scheduler_binding(function (callback) {
    var id = setTimeout(function () {
      callback(_Scheduler_succeed({}));
    }, time);

    return function () {
      clearTimeout(id);
    };
  });
}


// PROGRAMS

var _Platform_worker = F4(function (impl, flagDecoder, debugMetadata, args) {
  return _Platform_initialize(
    flagDecoder,
    args,
    impl.init,
    impl.update,
    impl.subscriptions,
    function () {
      return function () {};
    }
  );
});

// INITIALIZE A PROGRAM

function _Platform_initialize(
  flagDecoder,
  args,
  init,
  update,
  subscriptions,
  stepperBuilder
) {
  var result = A2(
    _Json_run,
    flagDecoder,
    _Json_wrap(args ? args["flags"] : undefined)
  );
  $gren_lang$core$Result$isOk(result) ||
    _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
  var managers = {};
  var initPair = init(result.a);
  var model = initPair.model;
  var stepper = stepperBuilder(sendToApp, model);
  var ports = _Platform_setupEffects(managers, sendToApp);

  function sendToApp(msg, viewMetadata) {
    var pair = A2(update, msg, model);
    stepper((model = pair.model), viewMetadata);
    _Platform_enqueueEffects(managers, pair.command, subscriptions(model));
  }

  _Platform_enqueueEffects(managers, initPair.command, subscriptions(model));

  return ports ? { ports: ports } : {};
}

// TRACK PRELOADS
//
// This is used by code in gren/browser and gren/http
// to register any HTTP requests that are triggered by init.
//

var _Platform_preload;

function _Platform_registerPreload(url) {
  _Platform_preload.add(url);
}

// EFFECT MANAGERS

var _Platform_effectManagers = {};

function _Platform_setupEffects(managers, sendToApp) {
  var ports;

  // setup all necessary effect managers
  for (var key in _Platform_effectManagers) {
    var manager = _Platform_effectManagers[key];

    if (manager.a) {
      ports = ports || {};
      ports[key] = manager.a(key, sendToApp);
    }

    managers[key] = _Platform_instantiateManager(manager, sendToApp);
  }

  return ports;
}

function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap) {
  return {
    b: init,
    c: onEffects,
    d: onSelfMsg,
    e: cmdMap,
    f: subMap,
  };
}

function _Platform_instantiateManager(info, sendToApp) {
  var router = {
    g: sendToApp,
    h: undefined,
  };

  var onEffects = info.c;
  var onSelfMsg = info.d;
  var cmdMap = info.e;
  var subMap = info.f;

  function loop(state) {
    return A2(
      _Scheduler_andThen,
      loop,
      _Scheduler_receive(function (msg) {
        var value = msg.a;

        if (msg.$ === 0) {
          return A3(onSelfMsg, router, value, state);
        }

        return cmdMap && subMap
          ? A4(onEffects, router, value.i, value.j, state)
          : A3(onEffects, router, cmdMap ? value.i : value.j, state);
      })
    );
  }

  return (router.h = _Scheduler_rawSpawn(
    A2(_Scheduler_andThen, loop, info.b)
  ));
}

// ROUTING

var _Platform_sendToApp = F2(function (router, msg) {
  return _Scheduler_binding(function (callback) {
    router.g(msg);
    callback(_Scheduler_succeed({}));
  });
});

var _Platform_sendToSelf = F2(function (router, msg) {
  return A2(_Scheduler_send, router.h, {
    $: 0,
    a: msg,
  });
});

// BAGS

function _Platform_leaf(home) {
  return function (value) {
    return {
      $: 1,
      k: home,
      l: value,
    };
  };
}

function _Platform_batch(list) {
  return {
    $: 2,
    m: list,
  };
}

var _Platform_map = F2(function (tagger, bag) {
  return {
    $: 3,
    n: tagger,
    o: bag,
  };
});

// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/gren/core/issues/980
//   https://github.com/gren/core/pull/981
//   https://github.com/gren/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.

// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;

function _Platform_enqueueEffects(managers, cmdBag, subBag) {
  _Platform_effectsQueue.push({
    p: managers,
    q: cmdBag,
    r: subBag,
  });

  if (_Platform_effectsActive) return;

  _Platform_effectsActive = true;
  for (var fx; (fx = _Platform_effectsQueue.shift()); ) {
    _Platform_dispatchEffects(fx.p, fx.q, fx.r);
  }
  _Platform_effectsActive = false;
}

function _Platform_dispatchEffects(managers, cmdBag, subBag) {
  var effectsDict = {};
  _Platform_gatherEffects(true, cmdBag, effectsDict, null);
  _Platform_gatherEffects(false, subBag, effectsDict, null);

  for (var home in managers) {
    _Scheduler_rawSend(managers[home], {
      $: "fx",
      a: effectsDict[home] || { i: [], j: [] },
    });
  }
}

function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers) {
  switch (bag.$) {
    case 1:
      var home = bag.k;
      var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
      effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
      return;

    case 2:
      var bags = bag.m;
      for (var idx = 0; idx < bags.length; idx++) {
        _Platform_gatherEffects(isCmd, bags[idx], effectsDict, taggers);
      }
      return;

    case 3:
      _Platform_gatherEffects(isCmd, bag.o, effectsDict, {
        s: bag.n,
        t: taggers,
      });
      return;
  }
}

function _Platform_toEffect(isCmd, home, taggers, value) {
  function applyTaggers(x) {
    for (var temp = taggers; temp; temp = temp.t) {
      x = temp.s(x);
    }
    return x;
  }

  var map = isCmd
    ? _Platform_effectManagers[home].e
    : _Platform_effectManagers[home].f;

  return A2(map, applyTaggers, value);
}

function _Platform_insert(isCmd, newEffect, effects) {
  effects = effects || { i: [], j: [] };

  isCmd
    ? (effects.i = A2($gren_lang$core$Array$pushLast, newEffect, effects.i))
    : (effects.j = A2($gren_lang$core$Array$pushLast, newEffect, effects.j));

  return effects;
}

// PORTS

function _Platform_checkPortName(name) {
  if (_Platform_effectManagers[name]) {
    _Debug_crash(3, name);
  }
}

// OUTGOING PORTS

function _Platform_outgoingPort(name, converter) {
  _Platform_checkPortName(name);
  _Platform_effectManagers[name] = {
    e: _Platform_outgoingPortMap,
    u: converter,
    a: _Platform_setupOutgoingPort,
  };
  return _Platform_leaf(name);
}

var _Platform_outgoingPortMap = F2(function (tagger, value) {
  return value;
});

function _Platform_setupOutgoingPort(name) {
  var subs = [];
  var converter = _Platform_effectManagers[name].u;

  // CREATE MANAGER

  var init = _Process_sleep(0);

  _Platform_effectManagers[name].b = init;
  _Platform_effectManagers[name].c = F3(function (
    router,
    cmdArray,
    state
  ) {
    for (var idx = 0; idx < cmdArray.length; idx++) {
      // grab a separate reference to subs in case unsubscribe is called
      var currentSubs = subs;
      var value = _Json_unwrap(converter(cmdArray[idx]));
      for (var subIdx = 0; subIdx < currentSubs.length; subIdx++) {
        currentSubs[subIdx](value);
      }
    }
    return init;
  });

  // PUBLIC API

  function subscribe(callback) {
    subs.push(callback);
  }

  function unsubscribe(callback) {
    // copy subs into a new array in case unsubscribe is called within a
    // subscribed callback
    subs = subs.slice();
    var index = subs.indexOf(callback);
    if (index >= 0) {
      subs.splice(index, 1);
    }
  }

  return {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
  };
}

// INCOMING PORTS

function _Platform_incomingPort(name, converter) {
  _Platform_checkPortName(name);
  _Platform_effectManagers[name] = {
    f: _Platform_incomingPortMap,
    u: converter,
    a: _Platform_setupIncomingPort,
  };
  return _Platform_leaf(name);
}

var _Platform_incomingPortMap = F2(function (tagger, finalTagger) {
  return function (value) {
    return tagger(finalTagger(value));
  };
});

function _Platform_setupIncomingPort(name, sendToApp) {
  var subs = [];
  var converter = _Platform_effectManagers[name].u;

  // CREATE MANAGER

  var init = _Scheduler_succeed(null);

  _Platform_effectManagers[name].b = init;
  _Platform_effectManagers[name].c = F3(function (
    router,
    subArray,
    state
  ) {
    subs = subArray;
    return init;
  });

  // PUBLIC API

  function send(incomingValue) {
    var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

    $gren_lang$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

    var value = result.a;
    for (var idx = 0; idx < subs.length; idx++) {
      sendToApp(subs[idx](value));
    }
  }

  return { send: send };
}

// EXPORT GREN MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//

function _Platform_export_UNUSED(exports) {
  scope["Gren"]
    ? _Platform_mergeExportsProd(scope["Gren"], exports)
    : (scope["Gren"] = exports);
}

function _Platform_mergeExportsProd(obj, exports) {
  for (var name in exports) {
    name in obj
      ? name == "init"
        ? _Debug_crash(6)
        : _Platform_mergeExportsProd(obj[name], exports[name])
      : (obj[name] = exports[name]);
  }
}

function _Platform_export(exports) {
  scope["Gren"]
    ? _Platform_mergeExportsDebug("Gren", scope["Gren"], exports)
    : (scope["Gren"] = exports);
}

function _Platform_mergeExportsDebug(moduleName, obj, exports) {
  for (var name in exports) {
    name in obj
      ? name == "init"
        ? _Debug_crash(6, moduleName)
        : _Platform_mergeExportsDebug(
            moduleName + "." + name,
            obj[name],
            exports[name]
          )
      : (obj[name] = exports[name]);
  }
}


// HELPERS

var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== "undefined" ? document : {};

function _VirtualDom_appendChild(parent, child) {
  parent.appendChild(child);
}

var _VirtualDom_init = F4(function (
  virtualNode,
  flagDecoder,
  debugMetadata,
  args
) {
  // NOTE: this function needs _Platform_export available to work

  /**_UNUSED/
	var node = args['node'];
	//*/
  /**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

  node.parentNode.replaceChild(
    _VirtualDom_render(virtualNode, function () {}),
    node
  );

  return {};
});

// TEXT

function _VirtualDom_text(string) {
  return {
    $: 0,
    a: string,
  };
}

// NODE

var _VirtualDom_nodeNS = F4(function (namespace, tag, factList, kids) {
  for (var descendantsCount = 0, i = 0; i < kids.length; i++) {
    var kid = kids[i];
    descendantsCount += kid.b || 0;
  }

  descendantsCount += kids.length;

  return {
    $: 1,
    c: tag,
    d: _VirtualDom_organizeFacts(factList),
    e: kids,
    f: namespace,
    b: descendantsCount,
  };
});

var _VirtualDom_node = F3(function (tag, factList, kidList) {
  return A4(_VirtualDom_nodeNS, undefined, tag, factList, kidList);
});

// KEYED NODE

var _VirtualDom_keyedNodeNS = F4(function (namespace, tag, factList, kids) {
  for (var descendantsCount = 0, i = 0; i < kids.length; i++) {
    var kid = kids[i];
    descendantsCount += kid.node.b || 0;
  }

  descendantsCount += kids.length;

  return {
    $: 2,
    c: tag,
    d: _VirtualDom_organizeFacts(factList),
    e: kids,
    f: namespace,
    b: descendantsCount,
  };
});

var _VirtualDom_keyedNode = F3(function (tag, factList, kidList) {
  return A4(_VirtualDom_keyedNodeNS, undefined, tag, factList, kidList);
});

// CUSTOM

function _VirtualDom_custom(factList, model, render, diff) {
  return {
    $: 3,
    d: _VirtualDom_organizeFacts(factList),
    g: model,
    h: render,
    i: diff,
  };
}

// MAP

var _VirtualDom_map = F2(function (tagger, node) {
  return {
    $: 4,
    j: tagger,
    k: node,
    b: 1 + (node.b || 0),
  };
});

// LAZY

function _VirtualDom_thunk(view, args, thunk) {
  return {
    $: 5,
    l: view,
    m: args,
    n: thunk,
    k: undefined,
  };
}

var _VirtualDom_lazy = F2(function (func, a) {
  return _VirtualDom_thunk(func, [a], function () {
    return func(a);
  });
});

var _VirtualDom_lazy2 = F3(function (func, a, b) {
  return _VirtualDom_thunk(func, [a, b], function () {
    return A2(func, a, b);
  });
});

var _VirtualDom_lazy3 = F4(function (func, a, b, c) {
  return _VirtualDom_thunk(func, [a, b, c], function () {
    return A3(func, a, b, c);
  });
});

var _VirtualDom_lazy4 = F5(function (func, a, b, c, d) {
  return _VirtualDom_thunk(func, [a, b, c, d], function () {
    return A4(func, a, b, c, d);
  });
});

var _VirtualDom_lazy5 = F6(function (func, a, b, c, d, e) {
  return _VirtualDom_thunk(func, [a, b, c, d, e], function () {
    return A5(func, a, b, c, d, e);
  });
});

var _VirtualDom_lazy6 = F7(function (func, a, b, c, d, e, f) {
  return _VirtualDom_thunk(func, [a, b, c, d, e, f], function () {
    return A6(func, a, b, c, d, e, f);
  });
});

var _VirtualDom_lazy7 = F8(function (func, a, b, c, d, e, f, g) {
  return _VirtualDom_thunk(func, [a, b, c, d, e, f, g], function () {
    return A7(func, a, b, c, d, e, f, g);
  });
});

var _VirtualDom_lazy8 = F9(function (func, a, b, c, d, e, f, g, h) {
  return _VirtualDom_thunk(func, [a, b, c, d, e, f, g, h], function () {
    return A8(func, a, b, c, d, e, f, g, h);
  });
});

// FACTS

var _VirtualDom_on = F2(function (key, handler) {
  return {
    $: "a0",
    o: key,
    p: handler,
  };
});
var _VirtualDom_style = F2(function (key, value) {
  return {
    $: "a1",
    o: key,
    p: value,
  };
});
var _VirtualDom_property = F2(function (key, value) {
  return {
    $: "a2",
    o: key,
    p: value,
  };
});
var _VirtualDom_attribute = F2(function (key, value) {
  return {
    $: "a3",
    o: key,
    p: value,
  };
});
var _VirtualDom_attributeNS = F3(function (namespace, key, value) {
  return {
    $: "a4",
    o: key,
    p: { f: namespace, p: value },
  };
});

// XSS ATTACK VECTOR CHECKS

function _VirtualDom_noScript(tag) {
  return tag == "script" ? "p" : tag;
}

function _VirtualDom_noOnOrFormAction(key) {
  return /^(on|formAction$)/i.test(key) ? "data-" + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key) {
  return key == "innerHTML" || key == "formAction" ? "data-" + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value) {
  return /^javascript:/i.test(value.replace(/\s/g, "")) ? "" : value;
}

function _VirtualDom_noJavaScriptUri(value) {
  return /^javascript:/i.test(value.replace(/\s/g, ""))
    ? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
    : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value) {
  return /^\s*(javascript:|data:text\/html)/i.test(value) ? "" : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value) {
  return /^\s*(javascript:|data:text\/html)/i.test(value)
    ? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
    : value;
}

// MAP FACTS

var _VirtualDom_mapAttribute = F2(function (func, attr) {
  return attr.$ === "a0"
    ? A2(_VirtualDom_on, attr.o, _VirtualDom_mapHandler(func, attr.p))
    : attr;
});

function _VirtualDom_mapHandler(func, handler) {
  var tag = $gren_lang$browser$VirtualDom$toHandlerInt(handler);

  // 0 = Normal
  // 1 = MayStopPropagation
  // 2 = MayPreventDefault
  // 3 = Custom

  var mappedDecoder;
  switch (tag) {
    case 0:
      A2($gren_lang$core$Json$Decode$map, func, handler.a);
      break;
    case 1:
      A3(
        $gren_lang$core$Json$Decode$map2,
        _VirtualDom_mapMayStopPropagation,
        $gren_lang$core$Json$Decode$succeed(func),
        handler.a
      );
      break;
    case 2:
      A3(
        $gren_lang$core$Json$Decode$map2,
        _VirtualDom_mapMayPreventDefault,
        $gren_lang$core$Json$Decode$succeed(func),
        handler.a
      );
      break;
    case 3:
      A3(
        $gren_lang$core$Json$Decode$map2,
        _VirtualDom_mapEventRecord,
        $gren_lang$core$Json$Decode$succeed(func),
        handler.a
      );
      break;
  }

  return {
    $: handler.$,
    a: mappedDecoder,
  };
}

var _VirtualDom_mapMayStopPropagation = F2(function (func, record) {
  return {
    message: func(record.message),
    stopPropagation: record.stopPropagation,
  };
});

var _VirtualDom_mapMayPreventDefault = F2(function (func, record) {
  return {
    message: func(record.message),
    preventDefault: record.preventDefault,
  };
});

var _VirtualDom_mapEventRecord = F2(function (func, record) {
  return {
    message: func(record.message),
    stopPropagation: record.stopPropagation,
    preventDefault: record.preventDefault,
  };
});

// ORGANIZE FACTS

function _VirtualDom_organizeFacts(factList) {
  for (var facts = {}, i = 0; i < factList.length; i++) {
    var entry = factList[i];

    var tag = entry.$;
    var key = entry.o;
    var value = entry.p;

    if (tag === "a2") {
      key === "className"
        ? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
        : (facts[key] = _Json_unwrap(value));

      continue;
    }

    var subFacts = facts[tag] || (facts[tag] = {});
    tag === "a3" && key === "class"
      ? _VirtualDom_addClass(subFacts, key, value)
      : (subFacts[key] = value);
  }

  return facts;
}

function _VirtualDom_addClass(object, key, newClass) {
  var classes = object[key];
  object[key] = classes ? classes + " " + newClass : newClass;
}

// RENDER

function _VirtualDom_render(vNode, eventNode) {
  var tag = vNode.$;

  if (tag === 5) {
    return _VirtualDom_render(
      vNode.k || (vNode.k = vNode.n()),
      eventNode
    );
  }

  if (tag === 0) {
    return _VirtualDom_doc.createTextNode(vNode.a);
  }

  if (tag === 4) {
    var subNode = vNode.k;
    var tagger = vNode.j;

    while (subNode.$ === 4) {
      typeof tagger !== "object"
        ? (tagger = [tagger, subNode.j])
        : tagger.push(subNode.j);

      subNode = subNode.k;
    }

    var subEventRoot = { j: tagger, q: eventNode };
    var domNode = _VirtualDom_render(subNode, subEventRoot);
    domNode.gren_event_node_ref = subEventRoot;
    return domNode;
  }

  if (tag === 3) {
    var domNode = vNode.h(vNode.g);
    _VirtualDom_applyFacts(domNode, eventNode, vNode.d);
    return domNode;
  }

  // at this point `tag` must be 1 or 2

  var domNode = vNode.f
    ? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
    : _VirtualDom_doc.createElement(vNode.c);

  if (_VirtualDom_divertHrefToApp && vNode.c == "a") {
    domNode.addEventListener("click", _VirtualDom_divertHrefToApp(domNode));
  }

  _VirtualDom_applyFacts(domNode, eventNode, vNode.d);

  for (var kids = vNode.e, i = 0; i < kids.length; i++) {
    _VirtualDom_appendChild(
      domNode,
      _VirtualDom_render(
        tag === 1 ? kids[i] : kids[i].node,
        eventNode
      )
    );
  }

  return domNode;
}

// APPLY FACTS

function _VirtualDom_applyFacts(domNode, eventNode, facts) {
  for (var key in facts) {
    var value = facts[key];

    key === "a1"
      ? _VirtualDom_applyStyles(domNode, value)
      : key === "a0"
      ? _VirtualDom_applyEvents(domNode, eventNode, value)
      : key === "a3"
      ? _VirtualDom_applyAttrs(domNode, value)
      : key === "a4"
      ? _VirtualDom_applyAttrsNS(domNode, value)
      : ((key !== "value" && key !== "checked") || domNode[key] !== value) &&
        (domNode[key] = value);
  }
}

// APPLY STYLES

function _VirtualDom_applyStyles(domNode, styles) {
  var domNodeStyle = domNode.style;

  for (var key in styles) {
    domNodeStyle[key] = styles[key];
  }
}

// APPLY ATTRS

function _VirtualDom_applyAttrs(domNode, attrs) {
  for (var key in attrs) {
    var value = attrs[key];
    typeof value !== "undefined"
      ? domNode.setAttribute(key, value)
      : domNode.removeAttribute(key);
  }
}

// APPLY NAMESPACED ATTRS

function _VirtualDom_applyAttrsNS(domNode, nsAttrs) {
  for (var key in nsAttrs) {
    var pair = nsAttrs[key];
    var namespace = pair.f;
    var value = pair.p;

    typeof value !== "undefined"
      ? domNode.setAttributeNS(namespace, key, value)
      : domNode.removeAttributeNS(namespace, key);
  }
}

// APPLY EVENTS

function _VirtualDom_applyEvents(domNode, eventNode, events) {
  var allCallbacks = domNode.grenFs || (domNode.grenFs = {});

  for (var key in events) {
    var newHandler = events[key];
    var oldCallback = allCallbacks[key];

    if (!newHandler) {
      domNode.removeEventListener(key, oldCallback);
      allCallbacks[key] = undefined;
      continue;
    }

    if (oldCallback) {
      var oldHandler = oldCallback.r;
      if (oldHandler.$ === newHandler.$) {
        oldCallback.r = newHandler;
        continue;
      }
      domNode.removeEventListener(key, oldCallback);
    }

    oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
    domNode.addEventListener(
      key,
      oldCallback,
      _VirtualDom_passiveSupported && {
        passive: $gren_lang$browser$VirtualDom$toHandlerInt(newHandler) < 2,
      }
    );
    allCallbacks[key] = oldCallback;
  }
}

// PASSIVE EVENTS

var _VirtualDom_passiveSupported;

try {
  window.addEventListener(
    "t",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        _VirtualDom_passiveSupported = true;
      },
    })
  );
} catch (e) {}

// EVENT HANDLERS

function _VirtualDom_makeCallback(eventNode, initialHandler) {
  function callback(event) {
    var handler = callback.r;
    var result = _Json_runHelp(handler.a, event);

    if (!$gren_lang$core$Result$isOk(result)) {
      return;
    }

    var tag = $gren_lang$browser$VirtualDom$toHandlerInt(handler);

    // 0 = Normal
    // 1 = MayStopPropagation
    // 2 = MayPreventDefault
    // 3 = Custom

    var value = result.a;
    var message = !tag ? value : value.message;
    var stopPropagation =
      tag == 1 || tag == 3 ? value.stopPropagation : false;
    var currentEventNode =
      (stopPropagation && event.stopPropagation(),
      (tag == 2 || tag == 3 ? value.preventDefault : false) &&
        event.preventDefault(),
      eventNode);
    var tagger;
    var i;
    while ((tagger = currentEventNode.j)) {
      if (typeof tagger == "function") {
        message = tagger(message);
      } else {
        for (var i = tagger.length; i--; ) {
          message = tagger[i](message);
        }
      }
      currentEventNode = currentEventNode.q;
    }
    currentEventNode(message, stopPropagation); // stopPropagation implies isSync
  }

  callback.r = initialHandler;

  return callback;
}

function _VirtualDom_equalEvents(x, y) {
  return x.$ == y.$ && _Json_equality(x.a, y.a);
}

// DIFF

// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y) {
  var patches = [];
  _VirtualDom_diffHelp(x, y, patches, 0);
  return patches;
}

function _VirtualDom_pushPatch(patches, type, index, data) {
  var patch = {
    $: type,
    s: index,
    t: data,
    u: undefined,
    v: undefined,
  };
  patches.push(patch);
  return patch;
}

function _VirtualDom_diffHelp(x, y, patches, index) {
  if (x === y) {
    return;
  }

  var xType = x.$;
  var yType = y.$;

  // Bail if you run into different types of nodes. Implies that the
  // structure has changed significantly and it's not worth a diff.
  if (xType !== yType) {
    if (xType === 1 && yType === 2) {
      y = _VirtualDom_dekey(y);
      yType = 1;
    } else {
      _VirtualDom_pushPatch(patches, 0, index, y);
      return;
    }
  }

  // Now we know that both nodes are the same $.
  switch (yType) {
    case 5:
      var xArgs = x.m;
      var yArgs = y.m;
      var i = xArgs.length;
      var same = i === yArgs.length && x.l === y.l;
      while (same && i--) {
        same = _Utils_eq(xArgs[i], yArgs[i]);
      }
      if (same) {
        y.k = x.k;
        return;
      }
      y.k = y.n();
      var subPatches = [];
      _VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
      subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
      return;

    case 4:
      // gather nested taggers
      var xTaggers = x.j;
      var yTaggers = y.j;
      var nesting = false;

      var xSubNode = x.k;
      while (xSubNode.$ === 4) {
        nesting = true;

        typeof xTaggers !== "object"
          ? (xTaggers = [xTaggers, xSubNode.j])
          : xTaggers.push(xSubNode.j);

        xSubNode = xSubNode.k;
      }

      var ySubNode = y.k;
      while (ySubNode.$ === 4) {
        nesting = true;

        typeof yTaggers !== "object"
          ? (yTaggers = [yTaggers, ySubNode.j])
          : yTaggers.push(ySubNode.j);

        ySubNode = ySubNode.k;
      }

      // Just bail if different numbers of taggers. This implies the
      // structure of the virtual DOM has changed.
      if (nesting && xTaggers.length !== yTaggers.length) {
        _VirtualDom_pushPatch(patches, 0, index, y);
        return;
      }

      // check if taggers are "the same"
      if (
        nesting
          ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers)
          : xTaggers !== yTaggers
      ) {
        _VirtualDom_pushPatch(patches, 2, index, yTaggers);
      }

      // diff everything below the taggers
      _VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
      return;

    case 0:
      if (x.a !== y.a) {
        _VirtualDom_pushPatch(patches, 3, index, y.a);
      }
      return;

    case 1:
      _VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
      return;

    case 2:
      _VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
      return;

    case 3:
      if (x.h !== y.h) {
        _VirtualDom_pushPatch(patches, 0, index, y);
        return;
      }

      var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
      factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

      var patch = y.i(x.g, y.g);
      patch && _VirtualDom_pushPatch(patches, 5, index, patch);

      return;
  }
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs) {
  for (var i = 0; i < as.length; i++) {
    if (as[i] !== bs[i]) {
      return false;
    }
  }

  return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids) {
  // Bail if obvious indicators have changed. Implies more serious
  // structural changes such that it's not worth it to diff.
  if (x.c !== y.c || x.f !== y.f) {
    _VirtualDom_pushPatch(patches, 0, index, y);
    return;
  }

  var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
  factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

  diffKids(x, y, patches, index);
}

// DIFF FACTS

// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category) {
  var diff;

  // look for changes and removals
  for (var xKey in x) {
    if (
      xKey === "a1" ||
      xKey === "a0" ||
      xKey === "a3" ||
      xKey === "a4"
    ) {
      var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
      if (subDiff) {
        diff = diff || {};
        diff[xKey] = subDiff;
      }
      continue;
    }

    // remove if not in the new facts
    if (!(xKey in y)) {
      diff = diff || {};
      diff[xKey] = !category
        ? typeof x[xKey] === "string"
          ? ""
          : null
        : category === "a1"
        ? ""
        : category === "a0" || category === "a3"
        ? undefined
        : { f: x[xKey].f, p: undefined };

      continue;
    }

    var xValue = x[xKey];
    var yValue = y[xKey];

    // reference equal, so don't worry about it
    if (
      (xValue === yValue && xKey !== "value" && xKey !== "checked") ||
      (category === "a0" && _VirtualDom_equalEvents(xValue, yValue))
    ) {
      continue;
    }

    diff = diff || {};
    diff[xKey] = yValue;
  }

  // add new stuff
  for (var yKey in y) {
    if (!(yKey in x)) {
      diff = diff || {};
      diff[yKey] = y[yKey];
    }
  }

  return diff;
}

// DIFF KIDS

function _VirtualDom_diffKids(xParent, yParent, patches, index) {
  var xKids = xParent.e;
  var yKids = yParent.e;

  var xLen = xKids.length;
  var yLen = yKids.length;

  // FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

  if (xLen > yLen) {
    _VirtualDom_pushPatch(patches, 6, index, {
      w: yLen,
      i: xLen - yLen,
    });
  } else if (xLen < yLen) {
    _VirtualDom_pushPatch(patches, 7, index, {
      w: xLen,
      e: yKids,
    });
  }

  // PAIRWISE DIFF EVERYTHING ELSE

  for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++) {
    var xKid = xKids[i];
    _VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
    index += xKid.b || 0;
  }
}

// KEYED DIFF

function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex) {
  var localPatches = [];

  var changes = {}; // Dict String Entry
  var inserts = []; // Array { index : Int, entry : Entry }
  // type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

  var xKids = xParent.e;
  var yKids = yParent.e;
  var xLen = xKids.length;
  var yLen = yKids.length;
  var xIndex = 0;
  var yIndex = 0;

  var index = rootIndex;

  while (xIndex < xLen && yIndex < yLen) {
    var x = xKids[xIndex];
    var y = yKids[yIndex];

    var xKey = x.key;
    var yKey = y.key;
    var xNode = x.node;
    var yNode = y.node;

    var newMatch = undefined;
    var oldMatch = undefined;

    // check if keys match

    if (xKey === yKey) {
      index++;
      _VirtualDom_diffHelp(xNode, yNode, localPatches, index);
      index += xNode.b || 0;

      xIndex++;
      yIndex++;
      continue;
    }

    // look ahead 1 to detect insertions and removals.

    var xNext = xKids[xIndex + 1];
    var yNext = yKids[yIndex + 1];

    if (xNext) {
      var xNextKey = xNext.key;
      var xNextNode = xNext.key;
      oldMatch = yKey === xNextKey;
    }

    if (yNext) {
      var yNextKey = yNext.key;
      var yNextNode = yNext.key;
      newMatch = xKey === yNextKey;
    }

    // swap x and y
    if (newMatch && oldMatch) {
      index++;
      _VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
      _VirtualDom_insertNode(
        changes,
        localPatches,
        xKey,
        yNode,
        yIndex,
        inserts
      );
      index += xNode.b || 0;

      index++;
      _VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
      index += xNextNode.b || 0;

      xIndex += 2;
      yIndex += 2;
      continue;
    }

    // insert y
    if (newMatch) {
      index++;
      _VirtualDom_insertNode(
        changes,
        localPatches,
        yKey,
        yNode,
        yIndex,
        inserts
      );
      _VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
      index += xNode.b || 0;

      xIndex += 1;
      yIndex += 2;
      continue;
    }

    // remove x
    if (oldMatch) {
      index++;
      _VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
      index += xNode.b || 0;

      index++;
      _VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
      index += xNextNode.b || 0;

      xIndex += 2;
      yIndex += 1;
      continue;
    }

    // remove x, insert y
    if (xNext && xNextKey === yNextKey) {
      index++;
      _VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
      _VirtualDom_insertNode(
        changes,
        localPatches,
        yKey,
        yNode,
        yIndex,
        inserts
      );
      index += xNode.b || 0;

      index++;
      _VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
      index += xNextNode.b || 0;

      xIndex += 2;
      yIndex += 2;
      continue;
    }

    break;
  }

  // eat up any remaining nodes with removeNode and insertNode

  while (xIndex < xLen) {
    index++;
    var x = xKids[xIndex];
    var xNode = x.node;
    _VirtualDom_removeNode(changes, localPatches, x.key, xNode, index);
    index += xNode.b || 0;
    xIndex++;
  }

  while (yIndex < yLen) {
    var endInserts = endInserts || [];
    var y = yKids[yIndex];
    _VirtualDom_insertNode(
      changes,
      localPatches,
      y.key,
      y.node,
      undefined,
      endInserts
    );
    yIndex++;
  }

  if (localPatches.length > 0 || inserts.length > 0 || endInserts) {
    _VirtualDom_pushPatch(patches, 8, rootIndex, {
      x: localPatches,
      y: inserts,
      z: endInserts,
    });
  }
}

// CHANGES FROM KEYED DIFF

var _VirtualDom_POSTFIX = "_grenW6BL";

function _VirtualDom_insertNode(
  changes,
  localPatches,
  key,
  vnode,
  yIndex,
  inserts
) {
  var entry = changes[key];

  // never seen this key before
  if (!entry) {
    entry = {
      c: 0,
      A: vnode,
      s: yIndex,
      t: undefined,
    };

    inserts.push({ s: yIndex, B: entry });
    changes[key] = entry;

    return;
  }

  // this key was removed earlier, a match!
  if (entry.c === 1) {
    inserts.push({ s: yIndex, B: entry });

    entry.c = 2;
    var subPatches = [];
    _VirtualDom_diffHelp(entry.A, vnode, subPatches, entry.s);
    entry.s = yIndex;
    entry.t.t = {
      x: subPatches,
      B: entry,
    };

    return;
  }

  // this key has already been inserted or moved, a duplicate!
  _VirtualDom_insertNode(
    changes,
    localPatches,
    key + _VirtualDom_POSTFIX,
    vnode,
    yIndex,
    inserts
  );
}

function _VirtualDom_removeNode(changes, localPatches, key, vnode, index) {
  var entry = changes[key];

  // never seen this key before
  if (!entry) {
    var patch = _VirtualDom_pushPatch(
      localPatches,
      9,
      index,
      undefined
    );

    changes[key] = {
      c: 1,
      A: vnode,
      s: index,
      t: patch,
    };

    return;
  }

  // this key was inserted earlier, a match!
  if (entry.c === 0) {
    entry.c = 2;
    var subPatches = [];
    _VirtualDom_diffHelp(vnode, entry.A, subPatches, index);

    _VirtualDom_pushPatch(localPatches, 9, index, {
      x: subPatches,
      B: entry,
    });

    return;
  }

  // this key has already been removed or moved, a duplicate!
  _VirtualDom_removeNode(
    changes,
    localPatches,
    key + _VirtualDom_POSTFIX,
    vnode,
    index
  );
}

// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.

function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode) {
  _VirtualDom_addDomNodesHelp(
    domNode,
    vNode,
    patches,
    0,
    0,
    vNode.b,
    eventNode
  );
}

// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(
  domNode,
  vNode,
  patches,
  i,
  low,
  high,
  eventNode
) {
  var patch = patches[i];
  var index = patch.s;

  while (index === low) {
    var patchType = patch.$;

    if (patchType === 1) {
      _VirtualDom_addDomNodes(domNode, vNode.k, patch.t, eventNode);
    } else if (patchType === 8) {
      patch.u = domNode;
      patch.v = eventNode;

      var subPatches = patch.t.x;
      if (subPatches.length > 0) {
        _VirtualDom_addDomNodesHelp(
          domNode,
          vNode,
          subPatches,
          0,
          low,
          high,
          eventNode
        );
      }
    } else if (patchType === 9) {
      patch.u = domNode;
      patch.v = eventNode;

      var data = patch.t;
      if (data) {
        data.B.t = domNode;
        var subPatches = data.x;
        if (subPatches.length > 0) {
          _VirtualDom_addDomNodesHelp(
            domNode,
            vNode,
            subPatches,
            0,
            low,
            high,
            eventNode
          );
        }
      }
    } else {
      patch.u = domNode;
      patch.v = eventNode;
    }

    i++;

    if (!(patch = patches[i]) || (index = patch.s) > high) {
      return i;
    }
  }

  var tag = vNode.$;

  if (tag === 4) {
    var subNode = vNode.k;

    while (subNode.$ === 4) {
      subNode = subNode.k;
    }

    return _VirtualDom_addDomNodesHelp(
      domNode,
      subNode,
      patches,
      i,
      low + 1,
      high,
      domNode.gren_event_node_ref
    );
  }

  // tag must be 1 or 2 at this point

  var vKids = vNode.e;
  var childNodes = domNode.childNodes;
  for (var j = 0; j < vKids.length; j++) {
    low++;
    var vKid = tag === 1 ? vKids[j] : vKids[j].node;
    var nextLow = low + (vKid.b || 0);
    if (low <= index && index <= nextLow) {
      i = _VirtualDom_addDomNodesHelp(
        childNodes[j],
        vKid,
        patches,
        i,
        low,
        nextLow,
        eventNode
      );
      if (!(patch = patches[i]) || (index = patch.s) > high) {
        return i;
      }
    }
    low = nextLow;
  }
  return i;
}

// APPLY PATCHES

function _VirtualDom_applyPatches(
  rootDomNode,
  oldVirtualNode,
  patches,
  eventNode
) {
  if (patches.length === 0) {
    return rootDomNode;
  }

  _VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
  return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches) {
  for (var i = 0; i < patches.length; i++) {
    var patch = patches[i];
    var localDomNode = patch.u;
    var newNode = _VirtualDom_applyPatch(localDomNode, patch);
    if (localDomNode === rootDomNode) {
      rootDomNode = newNode;
    }
  }
  return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch) {
  switch (patch.$) {
    case 0:
      return _VirtualDom_applyPatchRedraw(
        domNode,
        patch.t,
        patch.v
      );

    case 4:
      _VirtualDom_applyFacts(domNode, patch.v, patch.t);
      return domNode;

    case 3:
      domNode.replaceData(0, domNode.length, patch.t);
      return domNode;

    case 1:
      return _VirtualDom_applyPatchesHelp(domNode, patch.t);

    case 2:
      if (domNode.gren_event_node_ref) {
        domNode.gren_event_node_ref.j = patch.t;
      } else {
        domNode.gren_event_node_ref = {
          j: patch.t,
          q: patch.v,
        };
      }
      return domNode;

    case 6:
      var data = patch.t;
      for (var i = 0; i < data.i; i++) {
        domNode.removeChild(domNode.childNodes[data.w]);
      }
      return domNode;

    case 7:
      var data = patch.t;
      var kids = data.e;
      var i = data.w;
      var theEnd = domNode.childNodes[i];
      for (; i < kids.length; i++) {
        domNode.insertBefore(
          _VirtualDom_render(kids[i], patch.v),
          theEnd
        );
      }
      return domNode;

    case 9:
      var data = patch.t;
      if (!data) {
        domNode.parentNode.removeChild(domNode);
        return domNode;
      }
      var entry = data.B;
      if (typeof entry.s !== "undefined") {
        domNode.parentNode.removeChild(domNode);
      }
      entry.t = _VirtualDom_applyPatchesHelp(domNode, data.x);
      return domNode;

    case 8:
      return _VirtualDom_applyPatchReorder(domNode, patch);

    case 5:
      return patch.t(domNode);

    default:
      _Debug_crash(10); // 'Ran into an unknown patch!'
  }
}

function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode) {
  var parentNode = domNode.parentNode;
  var newNode = _VirtualDom_render(vNode, eventNode);

  if (!newNode.gren_event_node_ref) {
    newNode.gren_event_node_ref = domNode.gren_event_node_ref;
  }

  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode);
  }
  return newNode;
}

function _VirtualDom_applyPatchReorder(domNode, patch) {
  var data = patch.t;

  // remove end inserts
  var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(
    data.z,
    patch
  );

  // removals
  domNode = _VirtualDom_applyPatchesHelp(domNode, data.x);

  // inserts
  var inserts = data.y;
  for (var i = 0; i < inserts.length; i++) {
    var insert = inserts[i];
    var entry = insert.B;
    var node =
      entry.c === 2
        ? entry.t
        : _VirtualDom_render(entry.A, patch.v);
    domNode.insertBefore(node, domNode.childNodes[insert.s]);
  }

  // add end inserts
  if (frag) {
    _VirtualDom_appendChild(domNode, frag);
  }

  return domNode;
}

function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch) {
  if (!endInserts) {
    return;
  }

  var frag = _VirtualDom_doc.createDocumentFragment();
  for (var i = 0; i < endInserts.length; i++) {
    var insert = endInserts[i];
    var entry = insert.B;
    _VirtualDom_appendChild(
      frag,
      entry.c === 2
        ? entry.t
        : _VirtualDom_render(entry.A, patch.v)
    );
  }
  return frag;
}

function _VirtualDom_virtualize(node) {
  // TEXT NODES

  if (node.nodeType === 3) {
    return _VirtualDom_text(node.textContent);
  }

  // WEIRD NODES

  if (node.nodeType !== 1) {
    return _VirtualDom_text("");
  }

  // ELEMENT NODES

  var attrs = node.attributes;
  var attrList = new Array(attrs.length);

  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    var name = attr.name;
    var value = attr.value;
    attrList[i] = A2(_VirtualDom_attribute, name, value);
  }

  var tag = node.tagName.toLowerCase();
  var kids = node.childNodes;
  var kidList = new Array(kids.length);

  for (var i = 0; i < kids.length; i++) {
    kidList[i] = _VirtualDom_virtualize(kids[i]);
  }

  return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode) {
  var keyedKids = keyedNode.e;
  var len = keyedKids.length;
  var kids = new Array(len);

  for (var i = 0; i < len; i++) {
    kids[i] = keyedKids[i].b;
  }

  return {
    $: 1,
    c: keyedNode.c,
    d: keyedNode.d,
    e: kids,
    f: keyedNode.f,
    b: keyedNode.b,
  };
}


// ELEMENT

var _Debugger_element;

var _Browser_element =
  _Debugger_element ||
  F4(function (impl, flagDecoder, debugMetadata, args) {
    return _Platform_initialize(
      flagDecoder,
      args,
      impl.init,
      impl.update,
      impl.subscriptions,
      function (sendToApp, initialModel) {
        var view = impl.view;
        /**_UNUSED/
			var domNode = args['node'];
			//*/
        /**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
        var currNode = _VirtualDom_virtualize(domNode);

        return _Browser_makeAnimator(initialModel, function (model) {
          var nextNode = view(model);
          var patches = _VirtualDom_diff(currNode, nextNode);
          domNode = _VirtualDom_applyPatches(
            domNode,
            currNode,
            patches,
            sendToApp
          );
          currNode = nextNode;
        });
      }
    );
  });

// DOCUMENT

var _Debugger_document;

var _Browser_document =
  _Debugger_document ||
  F4(function (impl, flagDecoder, debugMetadata, args) {
    return _Platform_initialize(
      flagDecoder,
      args,
      impl.init,
      impl.update,
      impl.subscriptions,
      function (sendToApp, initialModel) {
        var divertHrefToApp = impl.setup && impl.setup(sendToApp);
        var view = impl.view;
        var title = _VirtualDom_doc.title;
        var bodyNode = _VirtualDom_doc.body;
        var currNode = _VirtualDom_virtualize(bodyNode);
        return _Browser_makeAnimator(initialModel, function (model) {
          _VirtualDom_divertHrefToApp = divertHrefToApp;
          var doc = view(model);
          var nextNode = _VirtualDom_node("body")([])(doc.body);
          var patches = _VirtualDom_diff(currNode, nextNode);
          bodyNode = _VirtualDom_applyPatches(
            bodyNode,
            currNode,
            patches,
            sendToApp
          );
          currNode = nextNode;
          _VirtualDom_divertHrefToApp = 0;
          title !== doc.title &&
            (_VirtualDom_doc.title = title = doc.title);
        });
      }
    );
  });

// ANIMATION

var _Browser_cancelAnimationFrame =
  typeof cancelAnimationFrame !== "undefined"
    ? cancelAnimationFrame
    : function (id) {
        clearTimeout(id);
      };

var _Browser_requestAnimationFrame =
  typeof requestAnimationFrame !== "undefined"
    ? requestAnimationFrame
    : function (callback) {
        return setTimeout(callback, 1000 / 60);
      };

function _Browser_makeAnimator(model, draw) {
  draw(model);

  var state = 0;

  function updateIfNeeded() {
    state =
      state === 1
        ? 0
        : (_Browser_requestAnimationFrame(updateIfNeeded),
          draw(model),
          1);
  }

  return function (nextModel, isSync) {
    model = nextModel;

    isSync
      ? (draw(model),
        state === 2 && (state = 1))
      : (state === 0 &&
          _Browser_requestAnimationFrame(updateIfNeeded),
        (state = 2));
  };
}

// APPLICATION

function _Browser_application(impl) {
  var onUrlChange = impl.onUrlChange;
  var onUrlRequest = impl.onUrlRequest;
  var key = function () {
    key.a(onUrlChange(_Browser_getUrl()));
  };

  return _Browser_document({
    setup: function (sendToApp) {
      key.a = sendToApp;
      _Browser_window.addEventListener("popstate", key);
      _Browser_window.navigator.userAgent.indexOf("Trident") < 0 ||
        _Browser_window.addEventListener("hashchange", key);

      return F2(function (domNode, event) {
        if (
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey &&
          event.button < 1 &&
          !domNode.target &&
          !domNode.hasAttribute("download")
        ) {
          event.preventDefault();
          var href = domNode.href;
          var curr = _Browser_getUrl();
          var next = $gren_lang$url$Url$fromString(href).a;
          sendToApp(
            onUrlRequest(
              next &&
                curr.protocol === next.protocol &&
                curr.host === next.host &&
                curr.port_.a === next.port_.a
                ? $gren_lang$browser$Browser$Internal(next)
                : $gren_lang$browser$Browser$External(href)
            )
          );
        }
      });
    },
    init: function (flags) {
      return A3(impl.init, flags, _Browser_getUrl(), key);
    },
    view: impl.view,
    update: impl.update,
    subscriptions: impl.subscriptions,
  });
}

function _Browser_getUrl() {
  return $gren_lang$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function (key, n) {
  return A2(
    $gren_lang$core$Task$perform,
    $gren_lang$core$Basics$never,
    _Scheduler_binding(function () {
      n && history.go(n);
      key();
    })
  );
});

var _Browser_pushUrl = F2(function (key, url) {
  return A2(
    $gren_lang$core$Task$perform,
    $gren_lang$core$Basics$never,
    _Scheduler_binding(function () {
      history.pushState({}, "", url);
      key();
    })
  );
});

var _Browser_replaceUrl = F2(function (key, url) {
  return A2(
    $gren_lang$core$Task$perform,
    $gren_lang$core$Basics$never,
    _Scheduler_binding(function () {
      history.replaceState({}, "", url);
      key();
    })
  );
});

// GLOBAL EVENTS

var _Browser_fakeNode = {
  addEventListener: function () {},
  removeEventListener: function () {},
};
var _Browser_doc =
  typeof document !== "undefined" ? document : _Browser_fakeNode;
var _Browser_window =
  typeof window !== "undefined" ? window : _Browser_fakeNode;

var _Browser_on = F3(function (node, eventName, sendToSelf) {
  return _Scheduler_spawn(
    _Scheduler_binding(function (callback) {
      function handler(event) {
        _Scheduler_rawSpawn(sendToSelf(event));
      }
      node.addEventListener(
        eventName,
        handler,
        _VirtualDom_passiveSupported && { passive: true }
      );
      return function () {
        node.removeEventListener(eventName, handler);
      };
    })
  );
});

var _Browser_decodeEvent = F2(function (decoder, event) {
  var result = _Json_runHelp(decoder, event);
  return $gren_lang$core$Result$isOk(result) ? $gren_lang$core$Maybe$Just(result.a) : $gren_lang$core$Maybe$Nothing;
});

// PAGE VISIBILITY

function _Browser_visibilityInfo() {
  return typeof _VirtualDom_doc.hidden !== "undefined"
    ? { hidden: "hidden", change: "visibilitychange" }
    : typeof _VirtualDom_doc.mozHidden !== "undefined"
    ? { hidden: "mozHidden", change: "mozvisibilitychange" }
    : typeof _VirtualDom_doc.msHidden !== "undefined"
    ? { hidden: "msHidden", change: "msvisibilitychange" }
    : typeof _VirtualDom_doc.webkitHidden !== "undefined"
    ? { hidden: "webkitHidden", change: "webkitvisibilitychange" }
    : { hidden: "hidden", change: "visibilitychange" };
}

// ANIMATION FRAMES

function _Browser_rAF() {
  return _Scheduler_binding(function (callback) {
    var id = _Browser_requestAnimationFrame(function () {
      callback(_Scheduler_succeed(Date.now()));
    });

    return function () {
      _Browser_cancelAnimationFrame(id);
    };
  });
}

function _Browser_now() {
  return _Scheduler_binding(function (callback) {
    callback(_Scheduler_succeed(Date.now()));
  });
}

// DOM STUFF

function _Browser_withNode(id, doStuff) {
  return _Scheduler_binding(function (callback) {
    _Browser_requestAnimationFrame(function () {
      var node = document.getElementById(id);
      callback(
        node
          ? _Scheduler_succeed(doStuff(node))
          : _Scheduler_fail($gren_lang$browser$Browser$Dom$NotFound(id))
      );
    });
  });
}

function _Browser_withWindow(doStuff) {
  return _Scheduler_binding(function (callback) {
    _Browser_requestAnimationFrame(function () {
      callback(_Scheduler_succeed(doStuff()));
    });
  });
}

// FOCUS and BLUR

var _Browser_call = F2(function (functionName, id) {
  return _Browser_withNode(id, function (node) {
    node[functionName]();
    return {};
  });
});

// WINDOW VIEWPORT

function _Browser_getViewport() {
  return {
    scene: _Browser_getScene(),
    viewport: {
      x: _Browser_window.pageXOffset,
      y: _Browser_window.pageYOffset,
      width: _Browser_doc.documentElement.clientWidth,
      height: _Browser_doc.documentElement.clientHeight,
    },
  };
}

function _Browser_getScene() {
  var body = _Browser_doc.body;
  var elem = _Browser_doc.documentElement;
  return {
    width: Math.max(
      body.scrollWidth,
      body.offsetWidth,
      elem.scrollWidth,
      elem.offsetWidth,
      elem.clientWidth
    ),
    height: Math.max(
      body.scrollHeight,
      body.offsetHeight,
      elem.scrollHeight,
      elem.offsetHeight,
      elem.clientHeight
    ),
  };
}

var _Browser_setViewport = F2(function (x, y) {
  return _Browser_withWindow(function () {
    _Browser_window.scroll(x, y);
    return {};
  });
});

// ELEMENT VIEWPORT

function _Browser_getViewportOf(id) {
  return _Browser_withNode(id, function (node) {
    return {
      scene: {
        width: node.scrollWidth,
        height: node.scrollHeight,
      },
      viewport: {
        x: node.scrollLeft,
        y: node.scrollTop,
        width: node.clientWidth,
        height: node.clientHeight,
      },
    };
  });
}

var _Browser_setViewportOf = F3(function (id, x, y) {
  return _Browser_withNode(id, function (node) {
    node.scrollLeft = x;
    node.scrollTop = y;
    return {};
  });
});

// ELEMENT

function _Browser_getElement(id) {
  return _Browser_withNode(id, function (node) {
    var rect = node.getBoundingClientRect();
    var x = _Browser_window.pageXOffset;
    var y = _Browser_window.pageYOffset;
    return {
      scene: _Browser_getScene(),
      viewport: {
        x: x,
        y: y,
        width: _Browser_doc.documentElement.clientWidth,
        height: _Browser_doc.documentElement.clientHeight,
      },
      element: {
        x: x + rect.left,
        y: y + rect.top,
        width: rect.width,
        height: rect.height,
      },
    };
  });
}

// LOAD and RELOAD

function _Browser_reload(skipCache) {
  return A2(
    $gren_lang$core$Task$perform,
    $gren_lang$core$Basics$never,
    _Scheduler_binding(function (callback) {
      _VirtualDom_doc.location.reload(skipCache);
    })
  );
}

function _Browser_load(url) {
  return A2(
    $gren_lang$core$Task$perform,
    $gren_lang$core$Basics$never,
    _Scheduler_binding(function (callback) {
      try {
        _Browser_window.location = url;
      } catch (err) {
        // Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
        // Other browsers reload the page, so let's be consistent about that.
        _VirtualDom_doc.location.reload(false);
      }
    })
  );
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $gren_lang$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $gren_lang$core$Maybe$Nothing;
	}
}


// MATH

var _Math_remainderBy = F2(function (b, a) {
  return a % b;
});

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Math_modBy = F2(function (modulus, x) {
  var answer = x % modulus;
  return modulus === 0
    ? _Debug_crash(11)
    : (answer > 0 && modulus < 0) || (answer < 0 && modulus > 0)
    ? answer + modulus
    : answer;
});

// TRIGONOMETRY

var _Math_pi = Math.PI;
var _Math_e = Math.E;
var _Math_cos = Math.cos;
var _Math_sin = Math.sin;
var _Math_tan = Math.tan;
var _Math_acos = Math.acos;
var _Math_asin = Math.asin;
var _Math_atan = Math.atan;
var _Math_atan2 = F2(Math.atan2);

// MORE MATH

function _Math_truncate(n) {
  return n | 0;
}

var _Math_ceiling = Math.ceil;
var _Math_floor = Math.floor;
var _Math_round = Math.round;
var _Math_sqrt = Math.sqrt;
var _Math_log = Math.log;
var $gren_lang$core$Basics$EQ = {$: 'EQ'};
var $gren_lang$core$Basics$GT = {$: 'GT'};
var $gren_lang$core$Basics$LT = {$: 'LT'};
var $gren_lang$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_gren_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($gren_lang$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $gren_lang$core$Array$pushLast = _Array_push;
var $gren_lang$core$Dict$keys = function (dict) {
	return A3(
		$gren_lang$core$Dict$foldl,
		F3(
			function (key, value, keyArray) {
				return A2($gren_lang$core$Array$pushLast, key, keyArray);
			}),
		[],
		dict);
};
var $gren_lang$core$Set$toArray = function (_v0) {
	var dict = _v0.a;
	return $gren_lang$core$Dict$keys(dict);
};
var $gren_lang$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $gren_lang$core$Maybe$Nothing = {$: 'Nothing'};
var $gren_lang$core$Dict$toArray = function (dict) {
	return A3(
		$gren_lang$core$Dict$foldl,
		F3(
			function (key, value, array) {
				return A2(
					$gren_lang$core$Array$pushLast,
					{key: key, value: value},
					array);
			}),
		[],
		dict);
};
var $gren_lang$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $gren_lang$core$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $gren_lang$core$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $gren_lang$core$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $gren_lang$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $gren_lang$core$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $gren_lang$core$Basics$False = {$: 'False'};
var $gren_lang$core$Basics$add = _Basics_add;
var $gren_lang$core$String$all = _String_all;
var $gren_lang$core$Basics$and = _Basics_and;
var $gren_lang$core$Basics$append = _Utils_append;
var $gren_lang$core$Json$Encode$encode = _Json_encode;
var $gren_lang$core$String$fromInt = _String_fromNumber;
var $gren_lang$core$String$join = _String_join;
var $gren_lang$core$String$split = _String_split;
var $gren_lang$core$Json$Decode$indent = function (str) {
	return A2(
		$gren_lang$core$String$join,
		'\n    ',
		A2($gren_lang$core$String$split, '\n', str));
};
var $gren_lang$core$Array$indexedMap = _Array_indexedMap;
var $gren_lang$core$Basics$le = _Utils_le;
var $gren_lang$core$Char$toCode = _Char_toCode;
var $gren_lang$core$Char$isLower = function (_char) {
	var code = $gren_lang$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $gren_lang$core$Char$isUpper = function (_char) {
	var code = $gren_lang$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $gren_lang$core$Basics$or = _Basics_or;
var $gren_lang$core$Char$isAlpha = function (_char) {
	return $gren_lang$core$Char$isLower(_char) || $gren_lang$core$Char$isUpper(_char);
};
var $gren_lang$core$Char$isDigit = function (_char) {
	var code = $gren_lang$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $gren_lang$core$Char$isAlphaNum = function (_char) {
	return $gren_lang$core$Char$isLower(_char) || ($gren_lang$core$Char$isUpper(_char) || $gren_lang$core$Char$isDigit(_char));
};
var $gren_lang$core$Array$length = _Array_length;
var $gren_lang$core$String$uncons = _String_uncons;
var $gren_lang$core$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($gren_lang$core$String$fromInt(i + 1) + (') ' + $gren_lang$core$Json$Decode$indent(
			$gren_lang$core$Json$Decode$errorToString(error))));
	});
var $gren_lang$core$Json$Decode$errorToString = function (error) {
	return A2(
		$gren_lang$core$Json$Decode$errorToStringHelp,
		error,
		[]);
};
var $gren_lang$core$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $gren_lang$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.first;
							var rest = _v2.rest;
							return $gren_lang$core$Char$isAlpha(_char) && A2($gren_lang$core$String$all, $gren_lang$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = _Utils_ap(
						[fieldName],
						context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($gren_lang$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = _Utils_ap(
						[indexName],
						context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					switch (errors.length) {
						case 0:
							return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
								if (context.length === 0) {
									return '!';
								} else {
									return ' at json' + A2($gren_lang$core$String$join, '', context);
								}
							}();
						case 1:
							var err = errors[0];
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						default:
							var starter = function () {
								if (context.length === 0) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2($gren_lang$core$String$join, '', context);
								}
							}();
							var introduction = starter + (' failed in the following ' + ($gren_lang$core$String$fromInt(
								$gren_lang$core$Array$length(errors)) + ' ways:'));
							return A2(
								$gren_lang$core$String$join,
								'\n\n',
								_Utils_ap(
									[introduction],
									A2($gren_lang$core$Array$indexedMap, $gren_lang$core$Json$Decode$errorOneOf, errors)));
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (context.length === 0) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2($gren_lang$core$String$join, '', context) + ':\n\n    ');
						}
					}();
					return introduction + ($gren_lang$core$Json$Decode$indent(
						A2($gren_lang$core$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $gren_lang$core$Basics$True = {$: 'True'};
var $gren_lang$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $gren_lang$core$Json$Decode$map = _Json_map1;
var $gren_lang$core$Json$Decode$map2 = _Json_map2;
var $gren_lang$core$Json$Decode$succeed = _Json_succeed;
var $gren_lang$browser$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $gren_lang$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $gren_lang$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $gren_lang$core$Basics$identity = function (x) {
	return x;
};
var $gren_lang$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $gren_lang$url$Url$Http = {$: 'Http'};
var $gren_lang$url$Url$Https = {$: 'Https'};
var $gren_lang$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $gren_lang$core$String$contains = _String_contains;
var $gren_lang$core$String$length = _String_length;
var $gren_lang$core$Basics$lt = _Utils_lt;
var $gren_lang$core$String$slice = _String_slice;
var $gren_lang$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$gren_lang$core$String$slice,
			n,
			$gren_lang$core$String$length(string),
			string);
	});
var $gren_lang$core$String$indices = _String_indexes;
var $gren_lang$core$Basics$eq = _Utils_equal;
var $gren_lang$core$String$isEmpty = function (string) {
	return string === '';
};
var $gren_lang$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($gren_lang$core$String$slice, 0, n, string);
	});
var $gren_lang$core$String$toInt = _String_toInt;
var $gren_lang$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($gren_lang$core$String$isEmpty(str) || A2($gren_lang$core$String$contains, '@', str)) {
			return $gren_lang$core$Maybe$Nothing;
		} else {
			var _v0 = A2($gren_lang$core$String$indices, ':', str);
			switch (_v0.length) {
				case 0:
					return $gren_lang$core$Maybe$Just(
						{fragment: frag, host: str, path: path, port_: $gren_lang$core$Maybe$Nothing, protocol: protocol, query: params});
				case 1:
					var i = _v0[0];
					var _v1 = $gren_lang$core$String$toInt(
						A2($gren_lang$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $gren_lang$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $gren_lang$core$Maybe$Just(
							{
								fragment: frag,
								host: A2($gren_lang$core$String$left, i, str),
								path: path,
								port_: port_,
								protocol: protocol,
								query: params
							});
					}
				default:
					return $gren_lang$core$Maybe$Nothing;
			}
		}
	});
var $gren_lang$core$Array$get = _Array_get;
var $gren_lang$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($gren_lang$core$String$isEmpty(str)) {
			return $gren_lang$core$Maybe$Nothing;
		} else {
			var _v0 = A2(
				$gren_lang$core$Array$get,
				0,
				A2($gren_lang$core$String$indices, '/', str));
			if (_v0.$ === 'Nothing') {
				return A5($gren_lang$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$gren_lang$url$Url$chompBeforePath,
					protocol,
					A2($gren_lang$core$String$dropLeft, i, str),
					params,
					frag,
					A2($gren_lang$core$String$left, i, str));
			}
		}
	});
var $gren_lang$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($gren_lang$core$String$isEmpty(str)) {
			return $gren_lang$core$Maybe$Nothing;
		} else {
			var _v0 = A2(
				$gren_lang$core$Array$get,
				0,
				A2($gren_lang$core$String$indices, '?', str));
			if (_v0.$ === 'Nothing') {
				return A4($gren_lang$url$Url$chompBeforeQuery, protocol, $gren_lang$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$gren_lang$url$Url$chompBeforeQuery,
					protocol,
					$gren_lang$core$Maybe$Just(
						A2($gren_lang$core$String$dropLeft, i + 1, str)),
					frag,
					A2($gren_lang$core$String$left, i, str));
			}
		}
	});
var $gren_lang$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($gren_lang$core$String$isEmpty(str)) {
			return $gren_lang$core$Maybe$Nothing;
		} else {
			var _v0 = A2(
				$gren_lang$core$Array$get,
				0,
				A2($gren_lang$core$String$indices, '#', str));
			if (_v0.$ === 'Nothing') {
				return A3($gren_lang$url$Url$chompBeforeFragment, protocol, $gren_lang$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$gren_lang$url$Url$chompBeforeFragment,
					protocol,
					$gren_lang$core$Maybe$Just(
						A2($gren_lang$core$String$dropLeft, i + 1, str)),
					A2($gren_lang$core$String$left, i, str));
			}
		}
	});
var $gren_lang$core$String$startsWith = _String_startsWith;
var $gren_lang$url$Url$fromString = function (str) {
	return A2($gren_lang$core$String$startsWith, 'http://', str) ? A2(
		$gren_lang$url$Url$chompAfterProtocol,
		$gren_lang$url$Url$Http,
		A2($gren_lang$core$String$dropLeft, 7, str)) : (A2($gren_lang$core$String$startsWith, 'https://', str) ? A2(
		$gren_lang$url$Url$chompAfterProtocol,
		$gren_lang$url$Url$Https,
		A2($gren_lang$core$String$dropLeft, 8, str)) : $gren_lang$core$Maybe$Nothing);
};
var $gren_lang$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $gren_lang$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $gren_lang$core$Task$succeed = _Scheduler_succeed;
var $gren_lang$core$Task$init = $gren_lang$core$Task$succeed(
	{});
var $gren_lang$core$Array$map = _Array_map;
var $gren_lang$core$Task$andThen = _Scheduler_andThen;
var $gren_lang$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $gren_lang$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$gren_lang$core$Task$andThen,
			function (a) {
				return $gren_lang$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $gren_lang$core$Array$foldl = _Array_foldl;
var $gren_lang$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$gren_lang$core$Task$andThen,
			function (a) {
				return A2(
					$gren_lang$core$Task$andThen,
					function (b) {
						return $gren_lang$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $gren_lang$core$Task$sequence = function (tasks) {
	return A3(
		$gren_lang$core$Array$foldl,
		$gren_lang$core$Task$map2($gren_lang$core$Array$pushLast),
		$gren_lang$core$Task$succeed(
			[]),
		tasks);
};
var $gren_lang$core$Platform$sendToApp = _Platform_sendToApp;
var $gren_lang$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$gren_lang$core$Task$andThen,
				$gren_lang$core$Platform$sendToApp(router),
				task));
	});
var $gren_lang$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$gren_lang$core$Task$map,
			function (_v0) {
				return {};
			},
			$gren_lang$core$Task$sequence(
				A2(
					$gren_lang$core$Array$map,
					$gren_lang$core$Task$spawnCmd(router),
					commands)));
	});
var $gren_lang$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $gren_lang$core$Task$succeed(
			{});
	});
var $gren_lang$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $gren_lang$core$Task$Perform(
			A2($gren_lang$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($gren_lang$core$Task$init, $gren_lang$core$Task$onEffects, $gren_lang$core$Task$onSelfMsg, $gren_lang$core$Task$cmdMap);
var $gren_lang$core$Task$command = _Platform_leaf('Task');
var $gren_lang$core$Task$perform = F2(
	function (toMessage, task) {
		return $gren_lang$core$Task$command(
			$gren_lang$core$Task$Perform(
				A2($gren_lang$core$Task$map, toMessage, task)));
	});
var $gren_lang$browser$Browser$document = _Browser_document;
var $gren_lang$core$Platform$Cmd$batch = _Platform_batch;
var $gren_lang$core$Platform$Cmd$none = $gren_lang$core$Platform$Cmd$batch(
	[]);
var $author$project$Main$GalvHoleModel = function (a) {
	return {$: 'GalvHoleModel', a: a};
};
var $author$project$Main$HomeModel = function (a) {
	return {$: 'HomeModel', a: a};
};
var $author$project$Main$KFactorModel = function (a) {
	return {$: 'KFactorModel', a: a};
};
var $author$project$Main$TriangleModel = function (a) {
	return {$: 'TriangleModel', a: a};
};
var $author$project$Main$TrussModel = function (a) {
	return {$: 'TrussModel', a: a};
};
var $gren_lang$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$hashToUrl = function (str) {
	var trimmedStr = 'http://localhost' + (A2($gren_lang$core$String$startsWith, '#/', str) ? A2($gren_lang$core$String$dropLeft, 1, str) : '/');
	return A2(
		$gren_lang$core$Maybe$withDefault,
		{fragment: $gren_lang$core$Maybe$Nothing, host: '', path: '/', port_: $gren_lang$core$Maybe$Nothing, protocol: $gren_lang$url$Url$Http, query: $gren_lang$core$Maybe$Nothing},
		$gren_lang$url$Url$fromString(trimmedStr));
};
var $author$project$Page$Home$init = {showRedir: false};
var $gren_lang$url$Url$Parser$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $gren_lang$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.visited;
		var unvisited = _v0.unvisited;
		var params = _v0.params;
		var frag = _v0.frag;
		var value = _v0.value;
		return {
			frag: frag,
			params: params,
			unvisited: unvisited,
			value: func(value),
			visited: visited
		};
	});
var $gren_lang$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0.a;
		return $gren_lang$url$Url$Parser$Parser(
			function (_v1) {
				var visited = _v1.visited;
				var unvisited = _v1.unvisited;
				var params = _v1.params;
				var frag = _v1.frag;
				var value = _v1.value;
				return A2(
					$gren_lang$core$Array$map,
					$gren_lang$url$Url$Parser$mapState(value),
					parseArg(
						{frag: frag, params: params, unvisited: unvisited, value: subValue, visited: visited}));
			});
	});
var $gren_lang$core$Array$prefix = _Array_append;
var $gren_lang$core$Array$flatMap = F2(
	function (mapper, array) {
		return A3(
			$gren_lang$core$Array$foldl,
			F2(
				function (v, acc) {
					return A2(
						$gren_lang$core$Array$prefix,
						acc,
						mapper(v));
				}),
			[],
			array);
	});
var $gren_lang$url$Url$Parser$oneOf = function (parsers) {
	return $gren_lang$url$Url$Parser$Parser(
		function (state) {
			return A2(
				$gren_lang$core$Array$flatMap,
				function (_v0) {
					var parser = _v0.a;
					return parser(state);
				},
				parsers);
		});
};
var $gren_lang$core$Array$slice = _Array_slice;
var $gren_lang$core$Array$dropFirst = F2(
	function (n, array) {
		return A3(
			$gren_lang$core$Array$slice,
			n,
			$gren_lang$core$Array$length(array),
			array);
	});
var $gren_lang$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		var _v0 = A2($gren_lang$core$Array$get, 0, states);
		if (_v0.$ === 'Nothing') {
			return $gren_lang$core$Maybe$Nothing;
		} else {
			var state = _v0.a;
			var _v1 = state.unvisited;
			_v1$2:
			while (true) {
				switch (_v1.length) {
					case 0:
						return $gren_lang$core$Maybe$Just(state.value);
					case 1:
						if (_v1[0] === '') {
							return $gren_lang$core$Maybe$Just(state.value);
						} else {
							break _v1$2;
						}
					default:
						break _v1$2;
				}
			}
			var $temp$states = A2($gren_lang$core$Array$dropFirst, 1, states);
			states = $temp$states;
			continue getFirstMatch;
		}
	}
};
var $gren_lang$url$Url$Parser$removeFinalEmpty = function (segments) {
	var _v0 = A2($gren_lang$core$Array$get, 0, segments);
	if (_v0.$ === 'Nothing') {
		return [];
	} else {
		if (_v0.a === '') {
			return [];
		} else {
			var segment = _v0.a;
			return _Utils_ap(
				[segment],
				$gren_lang$url$Url$Parser$removeFinalEmpty(
					A2($gren_lang$core$Array$dropFirst, 1, segments)));
		}
	}
};
var $gren_lang$url$Url$Parser$preparePath = function (path) {
	var segments = A2($gren_lang$core$String$split, '/', path);
	var _v0 = A2($gren_lang$core$Array$get, 0, segments);
	if ((_v0.$ === 'Just') && (_v0.a === '')) {
		return $gren_lang$url$Url$Parser$removeFinalEmpty(
			A2($gren_lang$core$Array$dropFirst, 1, segments));
	} else {
		return $gren_lang$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $gren_lang$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeArray) {
		if (maybeArray.$ === 'Nothing') {
			return $gren_lang$core$Maybe$Just(
				[value]);
		} else {
			var array = maybeArray.a;
			return $gren_lang$core$Maybe$Just(
				_Utils_ap(
					[value],
					array));
		}
	});
var $gren_lang$url$Url$percentDecode = _Url_percentDecode;
var $gren_lang$core$Basics$compare = _Utils_compare;
var $gren_lang$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_gren_builtin') {
				return $gren_lang$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($gren_lang$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $gren_lang$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $gren_lang$core$Dict$Black = {$: 'Black'};
var $gren_lang$core$Dict$RBNode_gren_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_gren_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $gren_lang$core$Dict$RBEmpty_gren_builtin = {$: 'RBEmpty_gren_builtin'};
var $gren_lang$core$Dict$Red = {$: 'Red'};
var $gren_lang$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_gren_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_gren_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$gren_lang$core$Dict$RBNode_gren_builtin,
					$gren_lang$core$Dict$Red,
					key,
					value,
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$gren_lang$core$Dict$RBNode_gren_builtin,
					color,
					rK,
					rV,
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_gren_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_gren_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$gren_lang$core$Dict$RBNode_gren_builtin,
					$gren_lang$core$Dict$Red,
					lK,
					lV,
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($gren_lang$core$Dict$RBNode_gren_builtin, color, key, value, left, right);
			}
		}
	});
var $gren_lang$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_gren_builtin') {
			return A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, key, value, $gren_lang$core$Dict$RBEmpty_gren_builtin, $gren_lang$core$Dict$RBEmpty_gren_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($gren_lang$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$gren_lang$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($gren_lang$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($gren_lang$core$Dict$RBNode_gren_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$gren_lang$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($gren_lang$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $gren_lang$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($gren_lang$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_gren_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $gren_lang$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_gren_builtin') && (dict.d.$ === 'RBNode_gren_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $gren_lang$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_gren_builtin') && (dict.d.$ === 'RBNode_gren_builtin')) && (dict.e.$ === 'RBNode_gren_builtin')) {
		if ((dict.e.d.$ === 'RBNode_gren_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$gren_lang$core$Dict$RBNode_gren_builtin,
				$gren_lang$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$gren_lang$core$Dict$RBNode_gren_builtin,
					$gren_lang$core$Dict$Black,
					k,
					v,
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$gren_lang$core$Dict$RBNode_gren_builtin,
					$gren_lang$core$Dict$Black,
					k,
					v,
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$gren_lang$core$Dict$RBNode_gren_builtin,
					$gren_lang$core$Dict$Black,
					k,
					v,
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $gren_lang$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_gren_builtin') && (dict.d.$ === 'RBNode_gren_builtin')) && (dict.e.$ === 'RBNode_gren_builtin')) {
		if ((dict.d.d.$ === 'RBNode_gren_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$gren_lang$core$Dict$RBNode_gren_builtin,
				$gren_lang$core$Dict$Red,
				lK,
				lV,
				A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$gren_lang$core$Dict$RBNode_gren_builtin,
					$gren_lang$core$Dict$Black,
					k,
					v,
					lRight,
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$gren_lang$core$Dict$RBNode_gren_builtin,
					$gren_lang$core$Dict$Black,
					k,
					v,
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$gren_lang$core$Dict$RBNode_gren_builtin,
					$gren_lang$core$Dict$Black,
					k,
					v,
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $gren_lang$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_gren_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$gren_lang$core$Dict$RBNode_gren_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_gren_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_gren_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $gren_lang$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $gren_lang$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $gren_lang$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_gren_builtin') && (dict.d.$ === 'RBNode_gren_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_gren_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$gren_lang$core$Dict$RBNode_gren_builtin,
					color,
					key,
					value,
					$gren_lang$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $gren_lang$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_gren_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$gren_lang$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$gren_lang$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $gren_lang$core$Dict$RBEmpty_gren_builtin;
				}
			}
		} else {
			return A5(
				$gren_lang$core$Dict$RBNode_gren_builtin,
				color,
				key,
				value,
				$gren_lang$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $gren_lang$core$Dict$RBEmpty_gren_builtin;
	}
};
var $gren_lang$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_gren_builtin') {
			return $gren_lang$core$Dict$RBEmpty_gren_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_gren_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_gren_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$gren_lang$core$Dict$RBNode_gren_builtin,
							color,
							key,
							value,
							A2($gren_lang$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $gren_lang$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_gren_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$gren_lang$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($gren_lang$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $gren_lang$core$Dict$RBEmpty_gren_builtin;
						}
					}
				} else {
					return A5(
						$gren_lang$core$Dict$RBNode_gren_builtin,
						color,
						key,
						value,
						A2($gren_lang$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$gren_lang$core$Dict$removeHelpEQGT,
					targetKey,
					A7($gren_lang$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $gren_lang$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_gren_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $gren_lang$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_gren_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$gren_lang$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$gren_lang$core$Dict$removeMin(right));
				} else {
					return $gren_lang$core$Dict$RBEmpty_gren_builtin;
				}
			} else {
				return A5(
					$gren_lang$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($gren_lang$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $gren_lang$core$Dict$RBEmpty_gren_builtin;
		}
	});
var $gren_lang$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($gren_lang$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_gren_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($gren_lang$core$Dict$RBNode_gren_builtin, $gren_lang$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $gren_lang$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($gren_lang$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($gren_lang$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($gren_lang$core$Dict$remove, targetKey, dictionary);
		}
	});
var $gren_lang$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($gren_lang$core$String$split, '=', segment);
		if (_v0.length === 2) {
			var rawKey = _v0[0];
			var rawValue = _v0[1];
			var _v1 = $gren_lang$url$Url$percentDecode(rawKey);
			if (_v1.$ === 'Nothing') {
				return dict;
			} else {
				var key = _v1.a;
				var _v2 = $gren_lang$url$Url$percentDecode(rawValue);
				if (_v2.$ === 'Nothing') {
					return dict;
				} else {
					var value = _v2.a;
					return A3(
						$gren_lang$core$Dict$update,
						key,
						$gren_lang$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $gren_lang$core$Dict$empty = $gren_lang$core$Dict$RBEmpty_gren_builtin;
var $gren_lang$core$Array$foldr = _Array_foldr;
var $gren_lang$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 'Nothing') {
		return $gren_lang$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$gren_lang$core$Array$foldr,
			$gren_lang$url$Url$Parser$addParam,
			$gren_lang$core$Dict$empty,
			A2($gren_lang$core$String$split, '&', qry));
	}
};
var $gren_lang$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0.a;
		return $gren_lang$url$Url$Parser$getFirstMatch(
			parser(
				{
					frag: url.fragment,
					params: $gren_lang$url$Url$Parser$prepareQuery(url.query),
					unvisited: $gren_lang$url$Url$Parser$preparePath(url.path),
					value: $gren_lang$core$Basics$identity,
					visited: []
				}));
	});
var $author$project$Page$GalvHole$Chs = {$: 'Chs'};
var $author$project$Page$GalvHole$chsLibrary = ['21.3', '26.9', '33.7', '42.4', '48.3', '60.3', '76.1', '88.9', '101.6', '114.3', '127', '139.7', '152.4', '165.1', '168.3', '193.7', '219.1', '273.1', '323.9', '355.6', '406.4', '457', '508', '610'];
var $gren_lang$core$Array$findFirst = _Array_findFirst;
var $gren_lang$core$Array$member = F2(
	function (value, array) {
		var _v0 = A2(
			$gren_lang$core$Array$findFirst,
			function (v) {
				return _Utils_eq(v, value);
			},
			array);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $gren_lang$core$Basics$not = _Basics_not;
var $author$project$Page$GalvHole$rhsLibrary = ['20*20', '25*25', '30*30', '35*35', '40*40', '50*20', '50*25', '50*50', '65*35', '65*65', '75*25', '75*50', '75*75', '76*38', '89*89', '90*90', '100*50', '100*100', '102*76', '125*75', '125*125', '127*51', '150*50', '150*100', '150*150', '152*76', '200*100', '200*200', '250*150', '250*250', '300*200', '300*300', '350*350', '400*200', '400*300', '400*400'];
var $author$project$Page$GalvHole$checkCustom = function (model) {
	var library = function () {
		var _v0 = model.ty;
		if (_v0.$ === 'Chs') {
			return $author$project$Page$GalvHole$chsLibrary;
		} else {
			return $author$project$Page$GalvHole$rhsLibrary;
		}
	}();
	var custom = model.c || (!A2($gren_lang$core$Array$member, model.size, library));
	return _Utils_update(
		model,
		{c: custom});
};
var $author$project$Page$GalvHole$makeChsModel = F3(
	function (n, c, size) {
		return $author$project$Page$GalvHole$checkCustom(
			{c: c, n: n, size: size, ty: $author$project$Page$GalvHole$Chs});
	});
var $author$project$Page$GalvHole$Rhs = {$: 'Rhs'};
var $author$project$Page$GalvHole$modelForTy = F2(
	function (n, ty) {
		return {
			c: false,
			n: n,
			size: function () {
				if (ty.$ === 'Rhs') {
					return '75*75';
				} else {
					return '48.3';
				}
			}(),
			ty: ty
		};
	});
var $author$project$Page$GalvHole$makeRhsModel = F3(
	function (n, c, size) {
		var _v0 = A2($gren_lang$core$String$split, '*', size);
		if (_v0.length === 2) {
			var x = _v0[0];
			var y = _v0[1];
			return $author$project$Page$GalvHole$checkCustom(
				{c: c, n: n, size: x + ('*' + y), ty: $author$project$Page$GalvHole$Rhs});
		} else {
			return A2($author$project$Page$GalvHole$modelForTy, n, $author$project$Page$GalvHole$Rhs);
		}
	});
var $gren_lang$url$Url$Parser$Internal$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $gren_lang$url$Url$Parser$Query$map3 = F4(
	function (func, _v0, _v1, _v2) {
		var a = _v0.a;
		var b = _v1.a;
		var c = _v2.a;
		return $gren_lang$url$Url$Parser$Internal$Parser(
			function (dict) {
				return A3(
					func,
					a(dict),
					b(dict),
					c(dict));
			});
	});
var $gren_lang$url$Url$Parser$Query$custom = F2(
	function (key, func) {
		return $gren_lang$url$Url$Parser$Internal$Parser(
			function (dict) {
				return func(
					A2(
						$gren_lang$core$Maybe$withDefault,
						[],
						A2($gren_lang$core$Dict$get, key, dict)));
			});
	});
var $gren_lang$url$Url$Parser$Query$string = function (key) {
	return A2(
		$gren_lang$url$Url$Parser$Query$custom,
		key,
		function (stringList) {
			if (stringList.length === 1) {
				var str = stringList[0];
				return $gren_lang$core$Maybe$Just(str);
			} else {
				return $gren_lang$core$Maybe$Nothing;
			}
		});
};
var $author$project$Page$GalvHole$queryParser = A4(
	$gren_lang$url$Url$Parser$Query$map3,
	F3(
		function (profileTypeMaybe, sizeMaybe, nMaybe) {
			var size = A2($gren_lang$core$Maybe$withDefault, '', sizeMaybe);
			var profileType = A2($gren_lang$core$Maybe$withDefault, '', profileTypeMaybe);
			var n = A2($gren_lang$core$Maybe$withDefault, '4', nMaybe);
			switch (profileType) {
				case 'RHS':
					return A3($author$project$Page$GalvHole$makeRhsModel, n, false, size);
				case 'SHS':
					return A3($author$project$Page$GalvHole$makeRhsModel, n, false, size);
				case 'CHS':
					return A3($author$project$Page$GalvHole$makeChsModel, n, false, size);
				default:
					return A3($author$project$Page$GalvHole$makeRhsModel, n, false, size);
			}
		}),
	$gren_lang$url$Url$Parser$Query$string('profileType'),
	$gren_lang$url$Url$Parser$Query$string('size'),
	$gren_lang$url$Url$Parser$Query$string('n'));
var $gren_lang$url$Url$Parser$Query$map = F2(
	function (func, _v0) {
		var a = _v0.a;
		return $gren_lang$url$Url$Parser$Internal$Parser(
			function (dict) {
				return func(
					a(dict));
			});
	});
var $author$project$Page$Home$queryParser = A2(
	$gren_lang$url$Url$Parser$Query$map,
	function (showRedir) {
		return {
			showRedir: _Utils_eq(
				showRedir,
				$gren_lang$core$Maybe$Just('true'))
		};
	},
	$gren_lang$url$Url$Parser$Query$string('show_redir'));
var $author$project$Page$KFactor$BendAllowance = {$: 'BendAllowance'};
var $author$project$Page$KFactor$ExtraAllowance = {$: 'ExtraAllowance'};
var $gren_lang$url$Url$Parser$Query$enum = F2(
	function (key, dict) {
		return A2(
			$gren_lang$url$Url$Parser$Query$custom,
			key,
			function (stringList) {
				if (stringList.length === 1) {
					var str = stringList[0];
					return A2($gren_lang$core$Dict$get, str, dict);
				} else {
					return $gren_lang$core$Maybe$Nothing;
				}
			});
	});
var $author$project$Page$KFactor$finishParse = F7(
	function (t, r, ba, a, k, xa, ty) {
		return {
			a: A2($gren_lang$core$Maybe$withDefault, '90', a),
			ba: A2($gren_lang$core$Maybe$withDefault, '', ba),
			k: A2($gren_lang$core$Maybe$withDefault, '', k),
			r: A2($gren_lang$core$Maybe$withDefault, '', r),
			t: A2($gren_lang$core$Maybe$withDefault, '', t),
			ty: A2($gren_lang$core$Maybe$withDefault, $author$project$Page$KFactor$ExtraAllowance, ty),
			xa: A2($gren_lang$core$Maybe$withDefault, '', xa)
		};
	});
var $gren_lang$core$Dict$fromArray = function (assocs) {
	return A3(
		$gren_lang$core$Array$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.key;
				var value = _v0.value;
				return A3($gren_lang$core$Dict$insert, key, value, dict);
			}),
		$gren_lang$core$Dict$empty,
		assocs);
};
var $gren_lang$url$Url$Parser$Query$map7 = F8(
	function (func, _v0, _v1, _v2, _v3, _v4, _v5, _v6) {
		var a = _v0.a;
		var b = _v1.a;
		var c = _v2.a;
		var d = _v3.a;
		var e = _v4.a;
		var f = _v5.a;
		var g = _v6.a;
		return $gren_lang$url$Url$Parser$Internal$Parser(
			function (dict) {
				return A7(
					func,
					a(dict),
					b(dict),
					c(dict),
					d(dict),
					e(dict),
					f(dict),
					g(dict));
			});
	});
var $author$project$Page$KFactor$queryParser = A8(
	$gren_lang$url$Url$Parser$Query$map7,
	$author$project$Page$KFactor$finishParse,
	$gren_lang$url$Url$Parser$Query$string('t'),
	$gren_lang$url$Url$Parser$Query$string('r'),
	$gren_lang$url$Url$Parser$Query$string('ba'),
	$gren_lang$url$Url$Parser$Query$string('a'),
	$gren_lang$url$Url$Parser$Query$string('k'),
	$gren_lang$url$Url$Parser$Query$string('xa'),
	A2(
		$gren_lang$url$Url$Parser$Query$enum,
		'ty',
		$gren_lang$core$Dict$fromArray(
			[
				{key: 'ba', value: $author$project$Page$KFactor$BendAllowance},
				{key: 'xa', value: $author$project$Page$KFactor$ExtraAllowance}
			])));
var $author$project$Page$Triangle$finishParse = F4(
	function (a, b, c, theta) {
		return {
			a: A2($gren_lang$core$Maybe$withDefault, '', a),
			b: A2($gren_lang$core$Maybe$withDefault, '', b),
			c: A2($gren_lang$core$Maybe$withDefault, '', c),
			theta: A2($gren_lang$core$Maybe$withDefault, '', theta)
		};
	});
var $gren_lang$url$Url$Parser$Query$map4 = F5(
	function (func, _v0, _v1, _v2, _v3) {
		var a = _v0.a;
		var b = _v1.a;
		var c = _v2.a;
		var d = _v3.a;
		return $gren_lang$url$Url$Parser$Internal$Parser(
			function (dict) {
				return A4(
					func,
					a(dict),
					b(dict),
					c(dict),
					d(dict));
			});
	});
var $author$project$Page$Triangle$queryParser = A5(
	$gren_lang$url$Url$Parser$Query$map4,
	$author$project$Page$Triangle$finishParse,
	$gren_lang$url$Url$Parser$Query$string('a'),
	$gren_lang$url$Url$Parser$Query$string('b'),
	$gren_lang$url$Url$Parser$Query$string('c'),
	$gren_lang$url$Url$Parser$Query$string('theta'));
var $gren_lang$url$Url$Parser$Query$map2 = F3(
	function (func, _v0, _v1) {
		var a = _v0.a;
		var b = _v1.a;
		return $gren_lang$url$Url$Parser$Internal$Parser(
			function (dict) {
				return A2(
					func,
					a(dict),
					b(dict));
			});
	});
var $author$project$Page$Truss$qApply = F2(
	function (argParser, funcParser) {
		return A3($gren_lang$url$Url$Parser$Query$map2, $gren_lang$core$Basics$apL, funcParser, argParser);
	});
var $author$project$Page$Truss$queryParser = A2(
	$author$project$Page$Truss$qApply,
	$gren_lang$url$Url$Parser$Query$string('title'),
	A2(
		$author$project$Page$Truss$qApply,
		$gren_lang$url$Url$Parser$Query$string('webStart'),
		A2(
			$author$project$Page$Truss$qApply,
			$gren_lang$url$Url$Parser$Query$string('webAngle'),
			A2(
				$author$project$Page$Truss$qApply,
				$gren_lang$url$Url$Parser$Query$string('roof'),
				A2(
					$author$project$Page$Truss$qApply,
					$gren_lang$url$Url$Parser$Query$string('nextCount'),
					A2(
						$author$project$Page$Truss$qApply,
						$gren_lang$url$Url$Parser$Query$string('nextWeb'),
						A2(
							$author$project$Page$Truss$qApply,
							$gren_lang$url$Url$Parser$Query$string('startCount'),
							A2(
								$author$project$Page$Truss$qApply,
								$gren_lang$url$Url$Parser$Query$string('startWeb'),
								A2(
									$author$project$Page$Truss$qApply,
									$gren_lang$url$Url$Parser$Query$string('web'),
									A2(
										$author$project$Page$Truss$qApply,
										$gren_lang$url$Url$Parser$Query$string('chordDoubling'),
										A2(
											$author$project$Page$Truss$qApply,
											$gren_lang$url$Url$Parser$Query$string('chordHeight'),
											A2(
												$author$project$Page$Truss$qApply,
												$gren_lang$url$Url$Parser$Query$string('chordGap'),
												A2(
													$gren_lang$url$Url$Parser$Query$map,
													function (chordLen) {
														return function (chordGap) {
															return function (chordHeight) {
																return function (chordDoubling) {
																	return function (web) {
																		return function (startWeb) {
																			return function (startCount) {
																				return function (nextWeb) {
																					return function (nextCount) {
																						return function (roof) {
																							return function (webAngle) {
																								return function (webStart) {
																									return function (title) {
																										return {
																											chordDoubling: A2($gren_lang$core$Maybe$withDefault, '', chordDoubling),
																											chordGap: A2($gren_lang$core$Maybe$withDefault, '', chordGap),
																											chordHeight: A2($gren_lang$core$Maybe$withDefault, '', chordHeight),
																											chordLen: A2($gren_lang$core$Maybe$withDefault, '', chordLen),
																											nextCount: A2($gren_lang$core$Maybe$withDefault, '', nextCount),
																											nextWeb: A2($gren_lang$core$Maybe$withDefault, '', nextWeb),
																											roof: A2($gren_lang$core$Maybe$withDefault, '', roof),
																											startCount: A2($gren_lang$core$Maybe$withDefault, '', startCount),
																											startWeb: A2($gren_lang$core$Maybe$withDefault, '', startWeb),
																											title: A2($gren_lang$core$Maybe$withDefault, 'Truss', title),
																											titleEdit: false,
																											web: A2($gren_lang$core$Maybe$withDefault, '', web),
																											webAngle: A2($gren_lang$core$Maybe$withDefault, '45', webAngle),
																											webStart: A2($gren_lang$core$Maybe$withDefault, '125', webStart)
																										};
																									};
																								};
																							};
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													},
													$gren_lang$url$Url$Parser$Query$string('chordLen'))))))))))))));
var $gren_lang$url$Url$Parser$query = function (_v0) {
	var queryParser = _v0.a;
	return $gren_lang$url$Url$Parser$Parser(
		function (_v1) {
			var visited = _v1.visited;
			var unvisited = _v1.unvisited;
			var params = _v1.params;
			var frag = _v1.frag;
			var value = _v1.value;
			return [
				{
				frag: frag,
				params: params,
				unvisited: unvisited,
				value: value(
					queryParser(params)),
				visited: visited
			}
			];
		});
};
var $gren_lang$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0.a;
		var parseAfter = _v1.a;
		return $gren_lang$url$Url$Parser$Parser(
			function (state) {
				return A2(
					$gren_lang$core$Array$flatMap,
					parseAfter,
					parseBefore(state));
			});
	});
var $gren_lang$url$Url$Parser$questionMark = F2(
	function (parser, queryParser) {
		return A2(
			$gren_lang$url$Url$Parser$slash,
			parser,
			$gren_lang$url$Url$Parser$query(queryParser));
	});
var $gren_lang$url$Url$Parser$s = function (str) {
	return $gren_lang$url$Url$Parser$Parser(
		function (_v0) {
			var visited = _v0.visited;
			var unvisited = _v0.unvisited;
			var params = _v0.params;
			var frag = _v0.frag;
			var value = _v0.value;
			var _v1 = A2($gren_lang$core$Array$get, 0, unvisited);
			if (_v1.$ === 'Nothing') {
				return [];
			} else {
				var next = _v1.a;
				return _Utils_eq(next, str) ? [
					{
					frag: frag,
					params: params,
					unvisited: A2($gren_lang$core$Array$dropFirst, 1, unvisited),
					value: value,
					visited: _Utils_ap(
						[next],
						visited)
				}
				] : [];
			}
		});
};
var $gren_lang$url$Url$Parser$top = $gren_lang$url$Url$Parser$Parser(
	function (state) {
		return [state];
	});
var $author$project$Main$urlToModel = function (path) {
	var url = $author$project$Main$hashToUrl(path);
	return A2(
		$gren_lang$core$Maybe$withDefault,
		$author$project$Main$HomeModel($author$project$Page$Home$init),
		A2(
			$gren_lang$url$Url$Parser$parse,
			$gren_lang$url$Url$Parser$oneOf(
				[
					A2(
					$gren_lang$url$Url$Parser$map,
					$author$project$Main$HomeModel,
					A2($gren_lang$url$Url$Parser$questionMark, $gren_lang$url$Url$Parser$top, $author$project$Page$Home$queryParser)),
					A2(
					$gren_lang$url$Url$Parser$map,
					$author$project$Main$GalvHoleModel,
					A2(
						$gren_lang$url$Url$Parser$questionMark,
						$gren_lang$url$Url$Parser$s('galv-hole'),
						$author$project$Page$GalvHole$queryParser)),
					A2(
					$gren_lang$url$Url$Parser$map,
					$author$project$Main$KFactorModel,
					A2(
						$gren_lang$url$Url$Parser$questionMark,
						$gren_lang$url$Url$Parser$s('k-factor'),
						$author$project$Page$KFactor$queryParser)),
					A2(
					$gren_lang$url$Url$Parser$map,
					$author$project$Main$TriangleModel,
					A2(
						$gren_lang$url$Url$Parser$questionMark,
						$gren_lang$url$Url$Parser$s('triangle'),
						$author$project$Page$Triangle$queryParser)),
					A2(
					$gren_lang$url$Url$Parser$map,
					$author$project$Main$TrussModel,
					A2(
						$gren_lang$url$Url$Parser$questionMark,
						$gren_lang$url$Url$Parser$s('truss'),
						$author$project$Page$Truss$queryParser))
				]),
			url));
};
var $author$project$Main$init = function (path) {
	return {
		command: $gren_lang$core$Platform$Cmd$none,
		model: $author$project$Main$urlToModel(path)
	};
};
var $author$project$Main$PageChanged = function (a) {
	return {$: 'PageChanged', a: a};
};
var $gren_lang$core$Json$Decode$string = _Json_decodeString;
var $author$project$Main$pageChanged = _Platform_incomingPort('pageChanged', $gren_lang$core$Json$Decode$string);
var $author$project$Main$pageChangedSubscription = $author$project$Main$pageChanged($author$project$Main$PageChanged);
var $author$project$Main$GalvHoleMsg = function (a) {
	return {$: 'GalvHoleMsg', a: a};
};
var $author$project$Main$HomeMsg = function (a) {
	return {$: 'HomeMsg', a: a};
};
var $author$project$Main$KFactorMsg = function (a) {
	return {$: 'KFactorMsg', a: a};
};
var $author$project$Main$TriangleMsg = function (a) {
	return {$: 'TriangleMsg', a: a};
};
var $author$project$Main$TrussMsg = function (a) {
	return {$: 'TrussMsg', a: a};
};
var $gren_lang$core$Json$Encode$string = _Json_wrap;
var $author$project$Main$changePage = _Platform_outgoingPort('changePage', $gren_lang$core$Json$Encode$string);
var $author$project$Main$copyId = _Platform_outgoingPort('copyId', $gren_lang$core$Json$Encode$string);
var $gren_lang$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $gren_lang$url$Url$Builder$toQuery = function (parameters) {
	if (parameters.length === 0) {
		return '';
	} else {
		return '?' + A2(
			$gren_lang$core$String$join,
			'&',
			A2($gren_lang$core$Array$map, $gren_lang$url$Url$Builder$toQueryPair, parameters));
	}
};
var $gren_lang$url$Url$Builder$absolute = F2(
	function (pathSegments, parameters) {
		return '/' + (A2($gren_lang$core$String$join, '/', pathSegments) + $gren_lang$url$Url$Builder$toQuery(parameters));
	});
var $gren_lang$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 'QueryParameter', a: a, b: b};
	});
var $gren_lang$url$Url$percentEncode = _Url_percentEncode;
var $gren_lang$url$Url$Builder$string = F2(
	function (key, value) {
		return A2(
			$gren_lang$url$Url$Builder$QueryParameter,
			$gren_lang$url$Url$percentEncode(key),
			$gren_lang$url$Url$percentEncode(value));
	});
var $author$project$Page$GalvHole$queryBuilder = function (model) {
	return [
		A2(
		$gren_lang$url$Url$Builder$string,
		'profileType',
		function () {
			var _v0 = model.ty;
			if (_v0.$ === 'Chs') {
				return 'CHS';
			} else {
				return 'RHS';
			}
		}()),
		A2($gren_lang$url$Url$Builder$string, 'size', model.size),
		A2($gren_lang$url$Url$Builder$string, 'n', model.n)
	];
};
var $author$project$Page$KFactor$builderStr = F3(
	function (_default, key, val) {
		return _Utils_eq(val, _default) ? $gren_lang$core$Maybe$Nothing : $gren_lang$core$Maybe$Just(
			A2($gren_lang$url$Url$Builder$string, key, val));
	});
var $gren_lang$core$Array$filterMap = F2(
	function (mapper, array) {
		return A3(
			$gren_lang$core$Array$foldl,
			F2(
				function (v, acc) {
					var _v0 = mapper(v);
					if (_v0.$ === 'Just') {
						var newValue = _v0.a;
						return A2($gren_lang$core$Array$pushLast, newValue, acc);
					} else {
						return acc;
					}
				}),
			[],
			array);
	});
var $author$project$Page$KFactor$queryBuilder = function (model) {
	return A2(
		$gren_lang$core$Array$filterMap,
		$gren_lang$core$Basics$identity,
		[
			A3($author$project$Page$KFactor$builderStr, '', 't', model.t),
			A3($author$project$Page$KFactor$builderStr, '', 'r', model.r),
			A3($author$project$Page$KFactor$builderStr, '', 'ba', model.ba),
			A3($author$project$Page$KFactor$builderStr, '90', 'a', model.a),
			A3($author$project$Page$KFactor$builderStr, '', 'k', model.k),
			A3($author$project$Page$KFactor$builderStr, '', 'xa', model.xa),
			$gren_lang$core$Maybe$Just(
			A2(
				$gren_lang$url$Url$Builder$string,
				'ty',
				function () {
					var _v0 = model.ty;
					if (_v0.$ === 'BendAllowance') {
						return 'ba';
					} else {
						return 'xa';
					}
				}()))
		]);
};
var $author$project$Page$Triangle$builderStr = F3(
	function (_default, key, val) {
		return _Utils_eq(val, _default) ? $gren_lang$core$Maybe$Nothing : $gren_lang$core$Maybe$Just(
			A2($gren_lang$url$Url$Builder$string, key, val));
	});
var $author$project$Page$Triangle$queryBuilder = function (model) {
	return A2(
		$gren_lang$core$Array$filterMap,
		$gren_lang$core$Basics$identity,
		[
			A3($author$project$Page$Triangle$builderStr, '', 'a', model.a),
			A3($author$project$Page$Triangle$builderStr, '', 'b', model.b),
			A3($author$project$Page$Triangle$builderStr, '', 'c', model.c),
			A3($author$project$Page$Triangle$builderStr, '', 'theta', model.theta)
		]);
};
var $author$project$Page$Truss$builderStr = F3(
	function (_default, key, val) {
		return _Utils_eq(val, _default) ? $gren_lang$core$Maybe$Nothing : $gren_lang$core$Maybe$Just(
			A2($gren_lang$url$Url$Builder$string, key, val));
	});
var $author$project$Page$Truss$queryBuilder = function (model) {
	return A2(
		$gren_lang$core$Array$filterMap,
		$gren_lang$core$Basics$identity,
		[
			A3($author$project$Page$Truss$builderStr, '', 'chordLen', model.chordLen),
			A3($author$project$Page$Truss$builderStr, '', 'chordGap', model.chordGap),
			A3($author$project$Page$Truss$builderStr, '', 'chordHeight', model.chordHeight),
			A3($author$project$Page$Truss$builderStr, '', 'chordDoubling', model.chordDoubling),
			A3($author$project$Page$Truss$builderStr, '', 'web', model.web),
			A3($author$project$Page$Truss$builderStr, '', 'startWeb', model.startWeb),
			A3($author$project$Page$Truss$builderStr, '', 'startCount', model.startCount),
			A3($author$project$Page$Truss$builderStr, '', 'nextWeb', model.nextWeb),
			A3($author$project$Page$Truss$builderStr, '', 'nextCount', model.nextCount),
			A3($author$project$Page$Truss$builderStr, '', 'roof', model.roof),
			A3($author$project$Page$Truss$builderStr, '45', 'webAngle', model.webAngle),
			A3($author$project$Page$Truss$builderStr, '125', 'webStart', model.webStart),
			A3($author$project$Page$Truss$builderStr, 'Truss', 'title', model.title)
		]);
};
var $author$project$Main$modelToUrl = function (model) {
	return '#' + A2(
		$gren_lang$url$Url$Builder$absolute,
		function () {
			switch (model.$) {
				case 'HomeModel':
					return [];
				case 'GalvHoleModel':
					return ['galv-hole'];
				case 'KFactorModel':
					return ['k-factor'];
				case 'TriangleModel':
					return ['triangle'];
				default:
					return ['truss'];
			}
		}(),
		function () {
			switch (model.$) {
				case 'HomeModel':
					return [];
				case 'GalvHoleModel':
					var t = model.a;
					return $author$project$Page$GalvHole$queryBuilder(t);
				case 'KFactorModel':
					var k = model.a;
					return $author$project$Page$KFactor$queryBuilder(k);
				case 'TriangleModel':
					var t = model.a;
					return $author$project$Page$Triangle$queryBuilder(t);
				default:
					var t = model.a;
					return $author$project$Page$Truss$queryBuilder(t);
			}
		}());
};
var $author$project$Main$redirectToTekPac = _Platform_outgoingPort('redirectToTekPac', $gren_lang$core$Json$Encode$string);
var $author$project$Main$handleSpaCmd = function (_v0) {
	var model = _v0.model;
	var command = _v0.command;
	switch (command.$) {
		case 'BaseCmd':
			var c = command.a;
			return {command: c, model: model};
		case 'ChangePage':
			var url = command.a;
			return {
				command: $author$project$Main$changePage(url),
				model: $author$project$Main$urlToModel(url)
			};
		case 'CopyId':
			var id = command.a;
			return {
				command: $author$project$Main$copyId(id),
				model: model
			};
		default:
			return {
				command: $author$project$Main$redirectToTekPac(
					$author$project$Main$modelToUrl(model)),
				model: model
			};
	}
};
var $author$project$Main$updatePage = _Platform_outgoingPort('updatePage', $gren_lang$core$Json$Encode$string);
var $author$project$Main$handleUrlUpdate = F2(
	function (orig, dat) {
		return _Utils_eq(orig, dat.model) ? dat : {
			command: $gren_lang$core$Platform$Cmd$batch(
				[
					$author$project$Main$updatePage(
					$author$project$Main$modelToUrl(dat.model)),
					dat.command
				]),
			model: dat.model
		};
	});
var $author$project$SpaCmd$BaseCmd = function (a) {
	return {$: 'BaseCmd', a: a};
};
var $author$project$SpaCmd$ChangePage = function (a) {
	return {$: 'ChangePage', a: a};
};
var $author$project$SpaCmd$CopyId = function (a) {
	return {$: 'CopyId', a: a};
};
var $author$project$SpaCmd$RedirectToTekPac = {$: 'RedirectToTekPac'};
var $gren_lang$core$Platform$Cmd$map = _Platform_map;
var $author$project$SpaCmd$map = F2(
	function (f, msg) {
		switch (msg.$) {
			case 'ChangePage':
				var url = msg.a;
				return $author$project$SpaCmd$ChangePage(url);
			case 'CopyId':
				var id = msg.a;
				return $author$project$SpaCmd$CopyId(id);
			case 'BaseCmd':
				var cb = msg.a;
				return $author$project$SpaCmd$BaseCmd(
					A2($gren_lang$core$Platform$Cmd$map, f, cb));
			default:
				return $author$project$SpaCmd$RedirectToTekPac;
		}
	});
var $author$project$Main$mapPage = F3(
	function (wrapModel, wrapMsg, _v0) {
		var model = _v0.model;
		var command = _v0.command;
		return {
			command: A2($author$project$SpaCmd$map, wrapMsg, command),
			model: wrapModel(model)
		};
	});
var $author$project$Page$GalvHole$NoOp = {$: 'NoOp'};
var $gren_lang$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $gren_lang$core$Task$onError = _Scheduler_onError;
var $gren_lang$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $gren_lang$core$Task$command(
			$gren_lang$core$Task$Perform(
				A2(
					$gren_lang$core$Task$onError,
					A2(
						$gren_lang$core$Basics$composeL,
						A2($gren_lang$core$Basics$composeL, $gren_lang$core$Task$succeed, resultToMessage),
						$gren_lang$core$Result$Err),
					A2(
						$gren_lang$core$Task$andThen,
						A2(
							$gren_lang$core$Basics$composeL,
							A2($gren_lang$core$Basics$composeL, $gren_lang$core$Task$succeed, resultToMessage),
							$gren_lang$core$Result$Ok),
						task))));
	});
var $gren_lang$browser$Browser$Dom$focus = _Browser_call('focus');
var $author$project$SpaCmd$none = $author$project$SpaCmd$BaseCmd($gren_lang$core$Platform$Cmd$none);
var $author$project$Page$GalvHole$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'NoOp':
				return {command: $author$project$SpaCmd$none, model: model};
			case 'UpdateTy':
				var ty = msg.a;
				return {
					command: $author$project$SpaCmd$none,
					model: A2($author$project$Page$GalvHole$modelForTy, model.n, ty)
				};
			case 'UpdateSizeS':
				var s = msg.a;
				return {
					command: $author$project$SpaCmd$none,
					model: _Utils_update(
						model,
						{c: false, size: s})
				};
			case 'UpdateSizeC':
				var s = msg.a;
				return {
					command: $author$project$SpaCmd$none,
					model: _Utils_update(
						model,
						{c: true, size: s})
				};
			case 'UpdateN':
				var n = msg.a;
				return {
					command: $author$project$SpaCmd$BaseCmd(
						A2(
							$gren_lang$core$Task$attempt,
							function (_v1) {
								return $author$project$Page$GalvHole$NoOp;
							},
							$gren_lang$browser$Browser$Dom$focus('n'))),
					model: _Utils_update(
						model,
						{n: n})
				};
			default:
				var id = msg.a;
				return {
					command: $author$project$SpaCmd$CopyId(id),
					model: model
				};
		}
	});
var $author$project$Page$Home$update = F2(
	function (msg, model) {
		return {command: $author$project$SpaCmd$RedirectToTekPac, model: $author$project$Page$Home$init};
	});
var $author$project$Page$KFactor$NoOp = {$: 'NoOp'};
var $author$project$Page$KFactor$attemptFocus = function (id) {
	return $author$project$SpaCmd$BaseCmd(
		A2(
			$gren_lang$core$Task$attempt,
			function (_v0) {
				return $author$project$Page$KFactor$NoOp;
			},
			$gren_lang$browser$Browser$Dom$focus(id)));
};
var $author$project$Page$KFactor$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'NoOp':
				return {command: $author$project$SpaCmd$none, model: model};
			case 'UpdateThickness':
				var s = msg.a;
				return {
					command: $author$project$Page$KFactor$attemptFocus('thickness'),
					model: _Utils_update(
						model,
						{t: s})
				};
			case 'UpdateRadius':
				var s = msg.a;
				return {
					command: $author$project$Page$KFactor$attemptFocus('radius'),
					model: _Utils_update(
						model,
						{r: s})
				};
			case 'UpdateAllowance':
				var s = msg.a;
				return {
					command: $author$project$Page$KFactor$attemptFocus('bend-allowance'),
					model: _Utils_update(
						model,
						{ba: s})
				};
			case 'UpdateExtraAllowance':
				var s = msg.a;
				return {
					command: $author$project$Page$KFactor$attemptFocus('extra-allowance'),
					model: _Utils_update(
						model,
						{xa: s})
				};
			case 'UpdateAngle':
				var s = msg.a;
				return {
					command: $author$project$Page$KFactor$attemptFocus('angle'),
					model: _Utils_update(
						model,
						{a: s})
				};
			case 'UpdateKFactor':
				var s = msg.a;
				return {
					command: $author$project$Page$KFactor$attemptFocus('k-factor'),
					model: _Utils_update(
						model,
						{k: s})
				};
			case 'UpdateTy':
				var ty = msg.a;
				return {
					command: $author$project$SpaCmd$none,
					model: _Utils_update(
						model,
						{ty: ty})
				};
			default:
				var id = msg.a;
				return {
					command: $author$project$SpaCmd$CopyId(id),
					model: model
				};
		}
	});
var $author$project$Page$Triangle$NoOp = {$: 'NoOp'};
var $author$project$Page$Triangle$attemptFocus = function (id) {
	return $author$project$SpaCmd$BaseCmd(
		A2(
			$gren_lang$core$Task$attempt,
			function (_v0) {
				return $author$project$Page$Triangle$NoOp;
			},
			$gren_lang$browser$Browser$Dom$focus(id)));
};
var $author$project$Page$Triangle$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'NoOp':
				return {command: $author$project$SpaCmd$none, model: model};
			case 'UpdateA':
				var s = msg.a;
				return {
					command: $author$project$Page$Triangle$attemptFocus('a'),
					model: _Utils_update(
						model,
						{a: s})
				};
			case 'UpdateB':
				var s = msg.a;
				return {
					command: $author$project$Page$Triangle$attemptFocus('b'),
					model: _Utils_update(
						model,
						{b: s})
				};
			case 'UpdateC':
				var s = msg.a;
				return {
					command: $author$project$Page$Triangle$attemptFocus('c'),
					model: _Utils_update(
						model,
						{c: s})
				};
			case 'UpdateTheta':
				var s = msg.a;
				return {
					command: $author$project$Page$Triangle$attemptFocus('theta'),
					model: _Utils_update(
						model,
						{theta: s})
				};
			default:
				var id = msg.a;
				return {
					command: $author$project$SpaCmd$CopyId(id),
					model: model
				};
		}
	});
var $author$project$Page$Truss$NoOp = {$: 'NoOp'};
var $author$project$Page$Truss$attemptFocus = function (id) {
	return $author$project$SpaCmd$BaseCmd(
		A2(
			$gren_lang$core$Task$attempt,
			function (_v0) {
				return $author$project$Page$Truss$NoOp;
			},
			$gren_lang$browser$Browser$Dom$focus(id)));
};
var $author$project$Page$Truss$doFocus = F2(
	function (model, id) {
		return {
			command: $author$project$Page$Truss$attemptFocus(id),
			model: model
		};
	});
var $author$project$Page$Truss$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'NoOp':
				return {command: $author$project$SpaCmd$none, model: model};
			case 'UpdateChordLen':
				var c = msg.a;
				return A2(
					$author$project$Page$Truss$doFocus,
					_Utils_update(
						model,
						{chordLen: c}),
					'chord-len');
			case 'UpdateChordGap':
				var c = msg.a;
				return A2(
					$author$project$Page$Truss$doFocus,
					_Utils_update(
						model,
						{chordGap: c}),
					'chord-gap');
			case 'UpdateChordHeight':
				var c = msg.a;
				return A2(
					$author$project$Page$Truss$doFocus,
					_Utils_update(
						model,
						{chordHeight: c}),
					'chord-height');
			case 'UpdateChordDoubling':
				var c = msg.a;
				return A2(
					$author$project$Page$Truss$doFocus,
					_Utils_update(
						model,
						{chordDoubling: c}),
					'chord-doubling');
			case 'UpdateWeb':
				var w = msg.a;
				return A2(
					$author$project$Page$Truss$doFocus,
					_Utils_update(
						model,
						{web: w}),
					'web');
			case 'UpdateStartWeb':
				var s = msg.a;
				return A2(
					$author$project$Page$Truss$doFocus,
					_Utils_update(
						model,
						{startWeb: s}),
					'start-web');
			case 'UpdateStartCount':
				var s = msg.a;
				return A2(
					$author$project$Page$Truss$doFocus,
					_Utils_update(
						model,
						{startCount: s}),
					'start-count');
			case 'UpdateNextWeb':
				var s = msg.a;
				return A2(
					$author$project$Page$Truss$doFocus,
					_Utils_update(
						model,
						{nextWeb: s}),
					'next-web');
			case 'UpdateNextCount':
				var s = msg.a;
				return A2(
					$author$project$Page$Truss$doFocus,
					_Utils_update(
						model,
						{nextCount: s}),
					'next-count');
			case 'UpdateRoof':
				var r = msg.a;
				return A2(
					$author$project$Page$Truss$doFocus,
					_Utils_update(
						model,
						{roof: r}),
					'roof');
			case 'UpdateWebAngle':
				var w = msg.a;
				return A2(
					$author$project$Page$Truss$doFocus,
					_Utils_update(
						model,
						{webAngle: w}),
					'web-angle');
			case 'UpdateWebStart':
				var w = msg.a;
				return A2(
					$author$project$Page$Truss$doFocus,
					_Utils_update(
						model,
						{webStart: w}),
					'web-start');
			case 'UpdateTitle':
				var w = msg.a;
				return {
					command: $author$project$SpaCmd$none,
					model: _Utils_update(
						model,
						{title: w})
				};
			case 'ToggleTitleEdit':
				return {
					command: (!model.titleEdit) ? $author$project$Page$Truss$attemptFocus('title') : $author$project$SpaCmd$none,
					model: _Utils_update(
						model,
						{titleEdit: !model.titleEdit})
				};
			default:
				var id = msg.a;
				return {
					command: $author$project$SpaCmd$CopyId(id),
					model: model
				};
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		var _v0 = {m: model, v: msg};
		_v0$6:
		while (true) {
			switch (_v0.v.$) {
				case 'PageChanged':
					var str = _v0.v.a;
					return {
						command: $gren_lang$core$Platform$Cmd$none,
						model: $author$project$Main$urlToModel(str)
					};
				case 'HomeMsg':
					if (_v0.m.$ === 'HomeModel') {
						var m = _v0.m.a;
						var v = _v0.v.a;
						return A2(
							$author$project$Main$handleUrlUpdate,
							model,
							$author$project$Main$handleSpaCmd(
								A3(
									$author$project$Main$mapPage,
									$author$project$Main$HomeModel,
									$author$project$Main$HomeMsg,
									A2($author$project$Page$Home$update, v, m))));
					} else {
						break _v0$6;
					}
				case 'GalvHoleMsg':
					if (_v0.m.$ === 'GalvHoleModel') {
						var m = _v0.m.a;
						var v = _v0.v.a;
						return A2(
							$author$project$Main$handleUrlUpdate,
							model,
							$author$project$Main$handleSpaCmd(
								A3(
									$author$project$Main$mapPage,
									$author$project$Main$GalvHoleModel,
									$author$project$Main$GalvHoleMsg,
									A2($author$project$Page$GalvHole$update, v, m))));
					} else {
						break _v0$6;
					}
				case 'KFactorMsg':
					if (_v0.m.$ === 'KFactorModel') {
						var m = _v0.m.a;
						var v = _v0.v.a;
						return A2(
							$author$project$Main$handleUrlUpdate,
							model,
							$author$project$Main$handleSpaCmd(
								A3(
									$author$project$Main$mapPage,
									$author$project$Main$KFactorModel,
									$author$project$Main$KFactorMsg,
									A2($author$project$Page$KFactor$update, v, m))));
					} else {
						break _v0$6;
					}
				case 'TriangleMsg':
					if (_v0.m.$ === 'TriangleModel') {
						var m = _v0.m.a;
						var v = _v0.v.a;
						return A2(
							$author$project$Main$handleUrlUpdate,
							model,
							$author$project$Main$handleSpaCmd(
								A3(
									$author$project$Main$mapPage,
									$author$project$Main$TriangleModel,
									$author$project$Main$TriangleMsg,
									A2($author$project$Page$Triangle$update, v, m))));
					} else {
						break _v0$6;
					}
				default:
					if (_v0.m.$ === 'TrussModel') {
						var m = _v0.m.a;
						var v = _v0.v.a;
						return A2(
							$author$project$Main$handleUrlUpdate,
							model,
							$author$project$Main$handleSpaCmd(
								A3(
									$author$project$Main$mapPage,
									$author$project$Main$TrussModel,
									$author$project$Main$TrussMsg,
									A2($author$project$Page$Truss$update, v, m))));
					} else {
						break _v0$6;
					}
			}
		}
		return {command: $gren_lang$core$Platform$Cmd$none, model: model};
	});
var $gren_lang$browser$VirtualDom$map = _VirtualDom_map;
var $gren_lang$browser$Html$map = $gren_lang$browser$VirtualDom$map;
var $author$project$Main$mapDocument = F2(
	function (map, doc) {
		return {
			body: A2(
				$gren_lang$core$Array$map,
				$gren_lang$browser$Html$map(map),
				doc.body),
			title: doc.title
		};
	});
var $author$project$Page$GalvHole$UpdateN = function (a) {
	return {$: 'UpdateN', a: a};
};
var $author$project$Page$GalvHole$UpdateTy = function (a) {
	return {$: 'UpdateTy', a: a};
};
var $gren_lang$browser$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $gren_lang$browser$Html$node = $gren_lang$browser$VirtualDom$node;
var $gren_lang$browser$Html$a = $gren_lang$browser$Html$node('a');
var $gren_lang$browser$Html$br = $gren_lang$browser$Html$node('br');
var $gren_lang$core$String$toFloat = _String_toFloat;
var $author$project$Page$GalvHole$calculateChsDiagonal = function (model) {
	var _v0 = $gren_lang$core$String$toFloat(model.size);
	if (_v0.$ === 'Just') {
		var od = _v0.a;
		return $gren_lang$core$Result$Ok(od);
	} else {
		return $gren_lang$core$Result$Err('enter an outside diameter');
	}
};
var $author$project$Page$GalvHole$getRhsStrings = function (size) {
	var _v0 = A2($gren_lang$core$String$split, '*', size);
	if (_v0.length === 2) {
		var x = _v0[0];
		var y = _v0[1];
		return {x: x, y: y};
	} else {
		return {x: '', y: ''};
	}
};
var $author$project$Page$GalvHole$getRhsVals = function (size) {
	var _v0 = $author$project$Page$GalvHole$getRhsStrings(size);
	var x = _v0.x;
	var y = _v0.y;
	return {
		x: $gren_lang$core$String$toFloat(x),
		y: $gren_lang$core$String$toFloat(y)
	};
};
var $gren_lang$core$Basics$mul = _Basics_mul;
var $gren_lang$core$Math$sqrt = _Math_sqrt;
var $author$project$Page$GalvHole$calculateRhsDiagonal = function (model) {
	var _v0 = $author$project$Page$GalvHole$getRhsVals(model.size);
	if (_v0.x.$ === 'Just') {
		if (_v0.y.$ === 'Just') {
			var x = _v0.x.a;
			var y = _v0.y.a;
			return $gren_lang$core$Result$Ok(
				$gren_lang$core$Math$sqrt((x * x) + (y * y)));
		} else {
			var _v2 = _v0.y;
			return $gren_lang$core$Result$Err('enter a height');
		}
	} else {
		var _v1 = _v0.x;
		return $gren_lang$core$Result$Err('enter a width');
	}
};
var $gren_lang$browser$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $gren_lang$browser$Html$Attributes$property = $gren_lang$browser$VirtualDom$property;
var $gren_lang$browser$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			$gren_lang$browser$Html$Attributes$property,
			key,
			$gren_lang$core$Json$Encode$string(string));
	});
var $gren_lang$browser$Html$Attributes$class = $gren_lang$browser$Html$Attributes$stringProperty('className');
var $gren_lang$browser$Html$div = $gren_lang$browser$Html$node('div');
var $gren_lang$core$Basics$fdiv = _Basics_fdiv;
var $gren_lang$browser$Html$h1 = $gren_lang$browser$Html$node('h1');
var $gren_lang$browser$Html$hr = $gren_lang$browser$Html$node('hr');
var $gren_lang$browser$Html$Attributes$href = function (url) {
	return A2($gren_lang$browser$Html$Attributes$stringProperty, 'href', url);
};
var $gren_lang$browser$Html$Attributes$id = $gren_lang$browser$Html$Attributes$stringProperty('id');
var $gren_lang$browser$Html$button = $gren_lang$browser$Html$node('button');
var $gren_lang$browser$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $gren_lang$browser$VirtualDom$on = _VirtualDom_on;
var $gren_lang$browser$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$gren_lang$browser$VirtualDom$on,
			event,
			$gren_lang$browser$VirtualDom$Normal(decoder));
	});
var $gren_lang$browser$Html$Events$onClick = function (msg) {
	return A2(
		$gren_lang$browser$Html$Events$on,
		'click',
		$gren_lang$core$Json$Decode$succeed(msg));
};
var $gren_lang$browser$VirtualDom$text = _VirtualDom_text;
var $gren_lang$browser$Html$text = $gren_lang$browser$VirtualDom$text;
var $author$project$Page$GalvHole$makeButton = F2(
	function (click, txt) {
		return A2(
			$gren_lang$browser$Html$button,
			[
				$gren_lang$browser$Html$Events$onClick(click)
			],
			[
				$gren_lang$browser$Html$text(txt)
			]);
	});
var $author$project$Page$GalvHole$UpdateSizeC = function (a) {
	return {$: 'UpdateSizeC', a: a};
};
var $author$project$Page$GalvHole$UpdateSizeS = function (a) {
	return {$: 'UpdateSizeS', a: a};
};
var $gren_lang$core$Array$first = function (array) {
	return A2($gren_lang$core$Array$get, 0, array);
};
var $gren_lang$core$Basics$sub = _Basics_sub;
var $gren_lang$core$Array$last = function (array) {
	return A2(
		$gren_lang$core$Array$get,
		$gren_lang$core$Array$length(array) - 1,
		array);
};
var $gren_lang$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $gren_lang$core$Maybe$Just(
				f(value));
		} else {
			return $gren_lang$core$Maybe$Nothing;
		}
	});
var $author$project$Page$GalvHole$makeArraySelector = F2(
	function (library, val) {
		var makeArraySelectorInternal = function (idx) {
			var prev = function () {
				var _v2 = A2($gren_lang$core$Array$get, idx - 1, library);
				if (_v2.$ === 'Just') {
					var a = _v2.a;
					return a;
				} else {
					return A2(
						$gren_lang$core$Maybe$withDefault,
						'never',
						$gren_lang$core$Array$last(library));
				}
			}();
			var next = function () {
				var _v1 = A2($gren_lang$core$Array$get, idx + 1, library);
				if (_v1.$ === 'Just') {
					var a = _v1.a;
					return a;
				} else {
					return A2(
						$gren_lang$core$Maybe$withDefault,
						'never',
						$gren_lang$core$Array$first(library));
				}
			}();
			return [
				A2(
				$author$project$Page$GalvHole$makeButton,
				$author$project$Page$GalvHole$UpdateSizeC(val),
				'Standard'),
				A2(
				$gren_lang$browser$Html$br,
				[],
				[]),
				A2(
				$author$project$Page$GalvHole$makeButton,
				$author$project$Page$GalvHole$UpdateSizeS(prev),
				'←'),
				$gren_lang$browser$Html$text(' '),
				A2(
				$author$project$Page$GalvHole$makeButton,
				$author$project$Page$GalvHole$UpdateSizeS(next),
				val),
				$gren_lang$browser$Html$text(' '),
				A2(
				$author$project$Page$GalvHole$makeButton,
				$author$project$Page$GalvHole$UpdateSizeS(next),
				'→')
			];
		};
		var getIndex = function (pos) {
			getIndex:
			while (true) {
				var _v0 = A2($gren_lang$core$Array$get, pos, library);
				if (_v0.$ === 'Just') {
					var v = _v0.a;
					if (_Utils_eq(v, val)) {
						return $gren_lang$core$Maybe$Just(pos);
					} else {
						var $temp$pos = pos + 1;
						pos = $temp$pos;
						continue getIndex;
					}
				} else {
					return $gren_lang$core$Maybe$Nothing;
				}
			}
		};
		var idxMaybe = getIndex(0);
		return A2($gren_lang$core$Maybe$map, makeArraySelectorInternal, idxMaybe);
	});
var $gren_lang$core$String$fromFloat = _String_fromNumber;
var $gren_lang$browser$Html$input = $gren_lang$browser$Html$node('input');
var $gren_lang$core$Basics$negate = function (n) {
	return -n;
};
var $gren_lang$browser$Html$Events$alwaysStop = function (msg) {
	return {message: msg, stopPropagation: true};
};
var $gren_lang$browser$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $gren_lang$browser$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$gren_lang$browser$VirtualDom$on,
			event,
			$gren_lang$browser$VirtualDom$MayStopPropagation(decoder));
	});
var $gren_lang$core$Json$Decode$field = _Json_decodeField;
var $gren_lang$core$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($gren_lang$core$Array$foldr, $gren_lang$core$Json$Decode$field, decoder, fields);
	});
var $gren_lang$browser$Html$Events$targetValue = A2(
	$gren_lang$core$Json$Decode$at,
	['target', 'value'],
	$gren_lang$core$Json$Decode$string);
var $gren_lang$browser$Html$Events$onInput = function (tagger) {
	return A2(
		$gren_lang$browser$Html$Events$stopPropagationOn,
		'input',
		A2(
			$gren_lang$core$Json$Decode$map,
			$gren_lang$browser$Html$Events$alwaysStop,
			A2($gren_lang$core$Json$Decode$map, tagger, $gren_lang$browser$Html$Events$targetValue)));
};
var $gren_lang$browser$Html$Attributes$step = function (n) {
	return A2($gren_lang$browser$Html$Attributes$stringProperty, 'step', n);
};
var $gren_lang$browser$VirtualDom$style = _VirtualDom_style;
var $gren_lang$browser$Html$Attributes$style = $gren_lang$browser$VirtualDom$style;
var $gren_lang$browser$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $gren_lang$browser$Html$Attributes$attribute = $gren_lang$browser$VirtualDom$attribute;
var $gren_lang$browser$Html$Attributes$tabindex = function (n) {
	return A2(
		$gren_lang$browser$Html$Attributes$attribute,
		'tabIndex',
		$gren_lang$core$String$fromInt(n));
};
var $gren_lang$browser$Html$Attributes$type_ = $gren_lang$browser$Html$Attributes$stringProperty('type');
var $gren_lang$browser$Html$Attributes$value = $gren_lang$browser$Html$Attributes$stringProperty('value');
var $author$project$Page$GalvHole$makeInput = F5(
	function (label, idTxt, stepV, currTxt, updateMsg) {
		return A2(
			$gren_lang$browser$Html$div,
			[],
			[
				$gren_lang$browser$Html$text(label),
				A2(
				$gren_lang$browser$Html$br,
				[],
				[]),
				$gren_lang$browser$Html$text('         '),
				A2(
				$gren_lang$browser$Html$input,
				[
					$gren_lang$browser$Html$Attributes$value(currTxt),
					$gren_lang$browser$Html$Events$onInput(updateMsg),
					$gren_lang$browser$Html$Attributes$id(idTxt),
					$gren_lang$browser$Html$Attributes$type_('number'),
					$gren_lang$browser$Html$Attributes$step(
					$gren_lang$core$String$fromFloat(stepV))
				],
				[]),
				$gren_lang$core$String$isEmpty(currTxt) ? A2(
				$gren_lang$browser$Html$button,
				[
					A2($gren_lang$browser$Html$Attributes$style, 'pointer-events', 'none'),
					A2($gren_lang$browser$Html$Attributes$style, 'opacity', '0'),
					$gren_lang$browser$Html$Attributes$tabindex(-1)
				],
				[
					$gren_lang$browser$Html$text('❌')
				]) : A2(
				$gren_lang$browser$Html$button,
				[
					$gren_lang$browser$Html$Events$onClick(
					updateMsg(''))
				],
				[
					$gren_lang$browser$Html$text('❌')
				])
			]);
	});
var $author$project$Page$GalvHole$makeChsInputs = function (model) {
	var isStandard = A2($gren_lang$core$Array$member, model.size, $author$project$Page$GalvHole$chsLibrary);
	var arraySel = model.c ? $gren_lang$core$Maybe$Nothing : A2($author$project$Page$GalvHole$makeArraySelector, $author$project$Page$GalvHole$chsLibrary, model.size);
	return A2(
		$gren_lang$browser$Html$div,
		[],
		function () {
			if (arraySel.$ === 'Just') {
				var a = arraySel.a;
				return a;
			} else {
				return [
					A2(
					$author$project$Page$GalvHole$makeButton,
					isStandard ? $author$project$Page$GalvHole$UpdateSizeS(model.size) : $author$project$Page$GalvHole$UpdateSizeS('48.3'),
					'Custom'),
					A5($author$project$Page$GalvHole$makeInput, 'Outer Diameter', 'od', 0.5, model.size, $author$project$Page$GalvHole$UpdateSizeC)
				];
			}
		}());
};
var $author$project$Page$GalvHole$DoCopy = function (a) {
	return {$: 'DoCopy', a: a};
};
var $gren_lang$core$Json$Encode$bool = _Json_wrap;
var $gren_lang$browser$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			$gren_lang$browser$Html$Attributes$property,
			key,
			$gren_lang$core$Json$Encode$bool(bool));
	});
var $gren_lang$browser$Html$Attributes$readonly = $gren_lang$browser$Html$Attributes$boolProperty('readOnly');
var $author$project$Page$GalvHole$makeOutput = F3(
	function (label, idTxt, calc) {
		return A2(
			$gren_lang$browser$Html$div,
			[],
			[
				$gren_lang$browser$Html$text(label),
				A2(
				$gren_lang$browser$Html$br,
				[],
				[]),
				$gren_lang$browser$Html$text('         '),
				A2(
				$gren_lang$browser$Html$input,
				[
					$gren_lang$browser$Html$Attributes$value(
					$gren_lang$core$String$fromFloat(calc)),
					$gren_lang$browser$Html$Attributes$readonly(true),
					$gren_lang$browser$Html$Attributes$id(idTxt),
					$gren_lang$browser$Html$Attributes$type_('number')
				],
				[]),
				A2(
				$gren_lang$browser$Html$button,
				[
					$gren_lang$browser$Html$Events$onClick(
					$author$project$Page$GalvHole$DoCopy(idTxt))
				],
				[
					$gren_lang$browser$Html$text('📋')
				])
			]);
	});
var $author$project$Page$GalvHole$makeRhsInputs = function (model) {
	var isStandard = A2($gren_lang$core$Array$member, model.size, $author$project$Page$GalvHole$rhsLibrary);
	var arraySel = model.c ? $gren_lang$core$Maybe$Nothing : A2($author$project$Page$GalvHole$makeArraySelector, $author$project$Page$GalvHole$rhsLibrary, model.size);
	var _v0 = $author$project$Page$GalvHole$getRhsStrings(model.size);
	var x = _v0.x;
	var y = _v0.y;
	return A2(
		$gren_lang$browser$Html$div,
		[],
		function () {
			if (arraySel.$ === 'Just') {
				var a = arraySel.a;
				return a;
			} else {
				return [
					A2(
					$author$project$Page$GalvHole$makeButton,
					isStandard ? $author$project$Page$GalvHole$UpdateSizeS(model.size) : $author$project$Page$GalvHole$UpdateSizeS('75*75'),
					'Custom'),
					A5(
					$author$project$Page$GalvHole$makeInput,
					'Width',
					'x',
					0.5,
					x,
					function (nx) {
						return $author$project$Page$GalvHole$UpdateSizeC(nx + ('*' + y));
					}),
					A5(
					$author$project$Page$GalvHole$makeInput,
					'Height',
					'y',
					0.5,
					y,
					function (ny) {
						return $author$project$Page$GalvHole$UpdateSizeC(x + ('*' + ny));
					})
				];
			}
		}());
};
var $gren_lang$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $gren_lang$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $gren_lang$core$Result$Err(e);
		}
	});
var $gren_lang$core$Basics$gt = _Utils_gt;
var $gren_lang$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $gren_lang$core$Math$round = _Math_round;
var $gren_lang$core$Basics$toFloat = _Basics_toFloat;
var $author$project$Page$GalvHole$view = function (model) {
	var tyInputs = function () {
		var _v5 = model.ty;
		if (_v5.$ === 'Chs') {
			return $author$project$Page$GalvHole$makeChsInputs(model);
		} else {
			return $author$project$Page$GalvHole$makeRhsInputs(model);
		}
	}();
	var tyCalc = function () {
		var _v3 = $gren_lang$core$String$toInt(model.n);
		if (_v3.$ === 'Just') {
			var n = _v3.a;
			var diagonalRes = function () {
				var _v4 = model.ty;
				if (_v4.$ === 'Chs') {
					return $author$project$Page$GalvHole$calculateChsDiagonal(model);
				} else {
					return $author$project$Page$GalvHole$calculateRhsDiagonal(model);
				}
			}();
			return A2(
				$gren_lang$core$Result$map,
				function (diagonal) {
					return {diagonal: diagonal, n: n};
				},
				diagonalRes);
		} else {
			return $gren_lang$core$Result$Err('enter number of holes');
		}
	}();
	var tyButton = function () {
		var _v2 = model.ty;
		if (_v2.$ === 'Chs') {
			return A2(
				$author$project$Page$GalvHole$makeButton,
				$author$project$Page$GalvHole$UpdateTy($author$project$Page$GalvHole$Rhs),
				'CHS');
		} else {
			return A2(
				$author$project$Page$GalvHole$makeButton,
				$author$project$Page$GalvHole$UpdateTy($author$project$Page$GalvHole$Chs),
				'RHS');
		}
	}();
	return {
		body: [
			A2(
			$gren_lang$browser$Html$a,
			[
				$gren_lang$browser$Html$Attributes$class('left'),
				$gren_lang$browser$Html$Attributes$href('#/')
			],
			[
				$gren_lang$browser$Html$text('Home')
			]),
			A2(
			$gren_lang$browser$Html$div,
			[
				$gren_lang$browser$Html$Attributes$id('galv-hole'),
				$gren_lang$browser$Html$Attributes$class('center')
			],
			[
				A2(
				$gren_lang$browser$Html$h1,
				[],
				[
					$gren_lang$browser$Html$text('Galvanising Holes')
				]),
				A2(
				$gren_lang$browser$Html$br,
				[],
				[]),
				tyButton,
				A2(
				$gren_lang$browser$Html$hr,
				[],
				[]),
				tyInputs,
				A2(
				$gren_lang$browser$Html$hr,
				[],
				[]),
				A5($author$project$Page$GalvHole$makeInput, 'No. of Holes', 'n', 1, model.n, $author$project$Page$GalvHole$UpdateN),
				A2(
				$gren_lang$browser$Html$hr,
				[],
				[]),
				function () {
				if (tyCalc.$ === 'Err') {
					var e = tyCalc.a;
					return A2(
						$gren_lang$browser$Html$div,
						[
							$gren_lang$browser$Html$Attributes$class('center')
						],
						[
							$gren_lang$browser$Html$text(e)
						]);
				} else {
					var _v1 = tyCalc.a;
					var diagonal = _v1.diagonal;
					var n = _v1.n;
					var formatF = function (value) {
						return $gren_lang$core$Math$round(value * 100) / 100;
					};
					var basisHole = diagonal / (4 * $gren_lang$core$Math$sqrt(n / 2));
					var dia = formatF(
						A2($gren_lang$core$Basics$max, 10, basisHole));
					return A2(
						$gren_lang$browser$Html$div,
						[
							$gren_lang$browser$Html$Attributes$class('center')
						],
						[
							A3($author$project$Page$GalvHole$makeOutput, 'Min diameter', 'dia', dia)
						]);
				}
			}()
			])
		],
		title: 'Galvanising Holes'
	};
};
var $author$project$Page$Home$DoRedir = {$: 'DoRedir'};
var $author$project$Page$Home$view = function (model) {
	return {
		body: [
			A2(
			$gren_lang$browser$Html$div,
			[
				$gren_lang$browser$Html$Attributes$class('center')
			],
			[
				A2(
				$gren_lang$browser$Html$h1,
				[],
				[
					$gren_lang$browser$Html$text('Calculators')
				]),
				model.showRedir ? A2(
				$gren_lang$browser$Html$button,
				[
					$gren_lang$browser$Html$Events$onClick($author$project$Page$Home$DoRedir)
				],
				[
					$gren_lang$browser$Html$text('Redirect to calc.tek-pac.com.au')
				]) : $gren_lang$browser$Html$text(''),
				model.showRedir ? A2(
				$gren_lang$browser$Html$br,
				[],
				[]) : $gren_lang$browser$Html$text(''),
				A2(
				$gren_lang$browser$Html$a,
				[
					$gren_lang$browser$Html$Attributes$href('#/k-factor')
				],
				[
					$gren_lang$browser$Html$text('K-Factors')
				]),
				$gren_lang$browser$Html$text(' '),
				A2(
				$gren_lang$browser$Html$a,
				[
					$gren_lang$browser$Html$Attributes$href('#/triangle')
				],
				[
					$gren_lang$browser$Html$text('Triangles')
				]),
				$gren_lang$browser$Html$text(' '),
				A2(
				$gren_lang$browser$Html$a,
				[
					$gren_lang$browser$Html$Attributes$href('#/truss')
				],
				[
					$gren_lang$browser$Html$text('Trusses')
				]),
				$gren_lang$browser$Html$text(' '),
				A2(
				$gren_lang$browser$Html$a,
				[
					$gren_lang$browser$Html$Attributes$href('#/galv-hole')
				],
				[
					$gren_lang$browser$Html$text('Galvanising Holes')
				])
			])
		],
		title: 'Calculators'
	};
};
var $author$project$Page$KFactor$DoCopy = function (a) {
	return {$: 'DoCopy', a: a};
};
var $author$project$Page$KFactor$UpdateAllowance = function (a) {
	return {$: 'UpdateAllowance', a: a};
};
var $author$project$Page$KFactor$UpdateAngle = function (a) {
	return {$: 'UpdateAngle', a: a};
};
var $author$project$Page$KFactor$UpdateExtraAllowance = function (a) {
	return {$: 'UpdateExtraAllowance', a: a};
};
var $author$project$Page$KFactor$UpdateKFactor = function (a) {
	return {$: 'UpdateKFactor', a: a};
};
var $author$project$Page$KFactor$UpdateRadius = function (a) {
	return {$: 'UpdateRadius', a: a};
};
var $author$project$Page$KFactor$UpdateThickness = function (a) {
	return {$: 'UpdateThickness', a: a};
};
var $author$project$Page$KFactor$UpdateTy = function (a) {
	return {$: 'UpdateTy', a: a};
};
var $author$project$Page$KFactor$emptyResult = {a: $gren_lang$core$Maybe$Nothing, ba: $gren_lang$core$Maybe$Nothing, k: $gren_lang$core$Maybe$Nothing, r: $gren_lang$core$Maybe$Nothing, t: $gren_lang$core$Maybe$Nothing, xa: $gren_lang$core$Maybe$Nothing};
var $author$project$Page$KFactor$parseModel = function (model) {
	var xa = $gren_lang$core$String$toFloat(model.xa);
	var t = $gren_lang$core$String$toFloat(model.t);
	var r = $gren_lang$core$String$toFloat(model.r);
	var k = $gren_lang$core$String$toFloat(model.k);
	var ba = $gren_lang$core$String$toFloat(model.ba);
	var a = $gren_lang$core$String$toFloat(model.a);
	return {a: a, ba: ba, k: k, r: r, t: t, ty: model.ty, xa: xa};
};
var $gren_lang$core$Math$pi = _Math_pi;
var $author$project$Page$KFactor$view = function (model) {
	var parsedModel = $author$project$Page$KFactor$parseModel(model);
	var makeSwapButton = function (updatedTy) {
		return A2(
			$gren_lang$browser$Html$button,
			[
				$gren_lang$browser$Html$Events$onClick(
				$author$project$Page$KFactor$UpdateTy(updatedTy))
			],
			[
				$gren_lang$browser$Html$text('Swap')
			]);
	};
	var makeInputDiv = F6(
		function (txt, idTxt, stepV, calcF, modelT, msgF) {
			return A2(
				$gren_lang$browser$Html$div,
				[],
				[
					$gren_lang$browser$Html$text(txt),
					A2(
					$gren_lang$browser$Html$br,
					[],
					[]),
					function () {
					if (calcF.$ === 'Just') {
						var t = calcF.a;
						return A2(
							$gren_lang$browser$Html$input,
							[
								$gren_lang$browser$Html$Attributes$value(
								$gren_lang$core$String$fromFloat(t)),
								$gren_lang$browser$Html$Attributes$readonly(true),
								$gren_lang$browser$Html$Attributes$id(idTxt),
								$gren_lang$browser$Html$Attributes$type_('number'),
								$gren_lang$browser$Html$Attributes$step(stepV)
							],
							[]);
					} else {
						return A2(
							$gren_lang$browser$Html$input,
							[
								$gren_lang$browser$Html$Attributes$value(modelT),
								$gren_lang$browser$Html$Events$onInput(msgF),
								$gren_lang$browser$Html$Attributes$id(idTxt),
								$gren_lang$browser$Html$Attributes$type_('number'),
								$gren_lang$browser$Html$Attributes$step(stepV)
							],
							[]);
					}
				}(),
					function () {
					if (calcF.$ === 'Just') {
						var t = calcF.a;
						return A2(
							$gren_lang$browser$Html$button,
							[
								$gren_lang$browser$Html$Events$onClick(
								$author$project$Page$KFactor$DoCopy(idTxt))
							],
							[
								$gren_lang$browser$Html$text('📋')
							]);
					} else {
						return $gren_lang$core$String$isEmpty(modelT) ? $gren_lang$browser$Html$text('') : A2(
							$gren_lang$browser$Html$button,
							[
								$gren_lang$browser$Html$Events$onClick(
								msgF(''))
							],
							[
								$gren_lang$browser$Html$text('❌')
							]);
					}
				}()
				]);
		});
	var formatFLow = function (value) {
		return $gren_lang$core$Maybe$Just(
			$gren_lang$core$Math$round(value * 1000000) / 1000000);
	};
	var formatF = function (value) {
		return $gren_lang$core$Maybe$Just(
			$gren_lang$core$Math$round(value * 10000000000) / 10000000000);
	};
	var res = function () {
		_v2$9:
		while (true) {
			if (parsedModel.t.$ === 'Just') {
				if (parsedModel.r.$ === 'Just') {
					if (parsedModel.k.$ === 'Nothing') {
						if (parsedModel.ty.$ === 'BendAllowance') {
							if ((parsedModel.ba.$ === 'Just') && (parsedModel.a.$ === 'Just')) {
								var t = parsedModel.t.a;
								var r = parsedModel.r.a;
								var ba = parsedModel.ba.a;
								var a = parsedModel.a.a;
								var _v3 = parsedModel.k;
								var _v4 = parsedModel.ty;
								return _Utils_update(
									$author$project$Page$KFactor$emptyResult,
									{
										k: formatF(((-r) + ((180 * ba) / (a * $gren_lang$core$Math$pi))) / t)
									});
							} else {
								break _v2$9;
							}
						} else {
							if (parsedModel.xa.$ === 'Just') {
								var t = parsedModel.t.a;
								var r = parsedModel.r.a;
								var xa = parsedModel.xa.a;
								var _v13 = parsedModel.k;
								var _v14 = parsedModel.ty;
								return _Utils_update(
									$author$project$Page$KFactor$emptyResult,
									{
										k: formatF(((((xa + (2 * r)) * 2) / $gren_lang$core$Math$pi) - r) / t)
									});
							} else {
								break _v2$9;
							}
						}
					} else {
						if (parsedModel.ty.$ === 'BendAllowance') {
							if (parsedModel.ba.$ === 'Just') {
								if (parsedModel.a.$ === 'Nothing') {
									var t = parsedModel.t.a;
									var r = parsedModel.r.a;
									var ba = parsedModel.ba.a;
									var _v5 = parsedModel.a;
									var k = parsedModel.k.a;
									var _v6 = parsedModel.ty;
									return _Utils_update(
										$author$project$Page$KFactor$emptyResult,
										{
											a: formatFLow(ba / (($gren_lang$core$Math$pi * ((k * t) + r)) / 180))
										});
								} else {
									break _v2$9;
								}
							} else {
								if (parsedModel.a.$ === 'Just') {
									var t = parsedModel.t.a;
									var r = parsedModel.r.a;
									var _v7 = parsedModel.ba;
									var a = parsedModel.a.a;
									var k = parsedModel.k.a;
									var _v8 = parsedModel.ty;
									return _Utils_update(
										$author$project$Page$KFactor$emptyResult,
										{
											ba: formatFLow((($gren_lang$core$Math$pi * ((k * t) + r)) / 180) * a)
										});
								} else {
									break _v2$9;
								}
							}
						} else {
							if (parsedModel.xa.$ === 'Nothing') {
								var t = parsedModel.t.a;
								var r = parsedModel.r.a;
								var _v15 = parsedModel.xa;
								var k = parsedModel.k.a;
								var _v16 = parsedModel.ty;
								return _Utils_update(
									$author$project$Page$KFactor$emptyResult,
									{
										xa: formatFLow((($gren_lang$core$Math$pi * ((k * t) + r)) / 2) - (2 * r))
									});
							} else {
								break _v2$9;
							}
						}
					}
				} else {
					if (parsedModel.k.$ === 'Just') {
						if (parsedModel.ty.$ === 'BendAllowance') {
							if ((parsedModel.ba.$ === 'Just') && (parsedModel.a.$ === 'Just')) {
								var t = parsedModel.t.a;
								var _v9 = parsedModel.r;
								var ba = parsedModel.ba.a;
								var a = parsedModel.a.a;
								var k = parsedModel.k.a;
								var _v10 = parsedModel.ty;
								return _Utils_update(
									$author$project$Page$KFactor$emptyResult,
									{
										r: formatFLow(-((k * t) - ((180 * ba) / ($gren_lang$core$Math$pi * a))))
									});
							} else {
								break _v2$9;
							}
						} else {
							if (parsedModel.xa.$ === 'Just') {
								var t = parsedModel.t.a;
								var _v17 = parsedModel.r;
								var xa = parsedModel.xa.a;
								var k = parsedModel.k.a;
								var _v18 = parsedModel.ty;
								return _Utils_update(
									$author$project$Page$KFactor$emptyResult,
									{
										r: formatFLow(((2 * xa) - (($gren_lang$core$Math$pi * k) * t)) / ($gren_lang$core$Math$pi - 360))
									});
							} else {
								break _v2$9;
							}
						}
					} else {
						break _v2$9;
					}
				}
			} else {
				if ((parsedModel.r.$ === 'Just') && (parsedModel.k.$ === 'Just')) {
					if (parsedModel.ty.$ === 'BendAllowance') {
						if ((parsedModel.ba.$ === 'Just') && (parsedModel.a.$ === 'Just')) {
							var _v11 = parsedModel.t;
							var r = parsedModel.r.a;
							var ba = parsedModel.ba.a;
							var a = parsedModel.a.a;
							var k = parsedModel.k.a;
							var _v12 = parsedModel.ty;
							return _Utils_update(
								$author$project$Page$KFactor$emptyResult,
								{
									t: formatFLow(((-r) + (ba / (($gren_lang$core$Math$pi * a) / 180))) / k)
								});
						} else {
							break _v2$9;
						}
					} else {
						if (parsedModel.xa.$ === 'Just') {
							var _v19 = parsedModel.t;
							var r = parsedModel.r.a;
							var xa = parsedModel.xa.a;
							var k = parsedModel.k.a;
							var _v20 = parsedModel.ty;
							return _Utils_update(
								$author$project$Page$KFactor$emptyResult,
								{
									t: formatFLow((((2 * xa) + (4 * r)) / ($gren_lang$core$Math$pi * k)) - (r / k))
								});
						} else {
							break _v2$9;
						}
					}
				} else {
					break _v2$9;
				}
			}
		}
		return $author$project$Page$KFactor$emptyResult;
	}();
	return {
		body: [
			A2(
			$gren_lang$browser$Html$a,
			[
				$gren_lang$browser$Html$Attributes$class('left'),
				$gren_lang$browser$Html$Attributes$href('#/')
			],
			[
				$gren_lang$browser$Html$text('Home')
			]),
			A2(
			$gren_lang$browser$Html$div,
			[
				$gren_lang$browser$Html$Attributes$id('k-factor-div'),
				$gren_lang$browser$Html$Attributes$class('center')
			],
			[
				function () {
				var _v0 = model.ty;
				if (_v0.$ === 'ExtraAllowance') {
					return $gren_lang$browser$Html$text('Extra Allowance ');
				} else {
					return $gren_lang$browser$Html$text('Bend Allowance ');
				}
			}(),
				function () {
				var _v1 = model.ty;
				if (_v1.$ === 'ExtraAllowance') {
					return makeSwapButton($author$project$Page$KFactor$BendAllowance);
				} else {
					return makeSwapButton($author$project$Page$KFactor$ExtraAllowance);
				}
			}(),
				A6(makeInputDiv, 'Thickness:', 'thickness', '0.1', res.t, model.t, $author$project$Page$KFactor$UpdateThickness),
				A6(makeInputDiv, 'Radius:', 'radius', '0.1', res.r, model.r, $author$project$Page$KFactor$UpdateRadius),
				_Utils_eq(model.ty, $author$project$Page$KFactor$BendAllowance) ? A6(makeInputDiv, 'Bend Allowance:', 'bend-allowance', '0.05', res.ba, model.ba, $author$project$Page$KFactor$UpdateAllowance) : A6(makeInputDiv, 'Extra Allowance:', 'extra-allowance', '0.05', res.xa, model.xa, $author$project$Page$KFactor$UpdateExtraAllowance),
				_Utils_eq(model.ty, $author$project$Page$KFactor$BendAllowance) ? A6(makeInputDiv, 'Angle:', 'angle', '1', res.a, model.a, $author$project$Page$KFactor$UpdateAngle) : $gren_lang$browser$Html$text(''),
				A6(makeInputDiv, 'K Factor:', 'k-factor', '0.001', res.k, model.k, $author$project$Page$KFactor$UpdateKFactor)
			])
		],
		title: 'K Factors'
	};
};
var $author$project$Page$Triangle$UpdateA = function (a) {
	return {$: 'UpdateA', a: a};
};
var $author$project$Page$Triangle$UpdateB = function (a) {
	return {$: 'UpdateB', a: a};
};
var $author$project$Page$Triangle$UpdateC = function (a) {
	return {$: 'UpdateC', a: a};
};
var $author$project$Page$Triangle$UpdateTheta = function (a) {
	return {$: 'UpdateTheta', a: a};
};
var $gren_lang$core$Math$acos = _Math_acos;
var $gren_lang$core$Result$andThen = F2(
	function (callback, result) {
		if (result.$ === 'Ok') {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $gren_lang$core$Result$Err(msg);
		}
	});
var $gren_lang$core$Math$asin = _Math_asin;
var $gren_lang$core$Math$atan = _Math_atan;
var $gren_lang$core$Math$cos = _Math_cos;
var $gren_lang$core$Math$degrees = function (angleInDegrees) {
	return (angleInDegrees * $gren_lang$core$Math$pi) / 180;
};
var $gren_lang$browser$Svg$Attributes$dx = $gren_lang$browser$VirtualDom$attribute('dx');
var $gren_lang$browser$Svg$Attributes$dy = $gren_lang$browser$VirtualDom$attribute('dy');
var $gren_lang$browser$VirtualDom$nodeNS = function (tag) {
	return _VirtualDom_nodeNS(
		_VirtualDom_noScript(tag));
};
var $gren_lang$browser$Svg$trustedNode = $gren_lang$browser$VirtualDom$nodeNS('http://www.w3.org/2000/svg');
var $gren_lang$browser$Svg$feComposite = $gren_lang$browser$Svg$trustedNode('feComposite');
var $gren_lang$browser$Svg$feFlood = $gren_lang$browser$Svg$trustedNode('feFlood');
var $gren_lang$browser$Svg$feGaussianBlur = $gren_lang$browser$Svg$trustedNode('feGaussianBlur');
var $gren_lang$browser$Svg$feOffset = $gren_lang$browser$Svg$trustedNode('feOffset');
var $gren_lang$browser$Svg$Attributes$fill = $gren_lang$browser$VirtualDom$attribute('fill');
var $gren_lang$browser$Svg$filter = $gren_lang$browser$Svg$trustedNode('filter');
var $gren_lang$browser$Svg$Attributes$floodColor = $gren_lang$browser$VirtualDom$attribute('flood-color');
var $gren_lang$browser$Svg$Attributes$floodOpacity = $gren_lang$browser$VirtualDom$attribute('flood-opacity');
var $gren_lang$core$Basics$ge = _Utils_ge;
var $gren_lang$core$Basics$isInfinite = _Basics_isInfinite;
var $gren_lang$core$Basics$isNaN = _Basics_isNaN;
var $author$project$Page$Triangle$getButtonExists = F2(
	function (calcVal, currTxt) {
		if (calcVal.$ === 'Just') {
			var t = calcVal.a;
			return ($gren_lang$core$Basics$isNaN(t) || $gren_lang$core$Basics$isInfinite(t)) ? false : true;
		} else {
			return $gren_lang$core$String$isEmpty(currTxt) ? false : true;
		}
	});
var $gren_lang$browser$Svg$Attributes$height = $gren_lang$browser$VirtualDom$attribute('height');
var $gren_lang$browser$Svg$Attributes$in2 = $gren_lang$browser$VirtualDom$attribute('in2');
var $gren_lang$browser$Svg$Attributes$in_ = $gren_lang$browser$VirtualDom$attribute('in');
var $author$project$Page$Triangle$DoCopy = function (a) {
	return {$: 'DoCopy', a: a};
};
var $gren_lang$browser$Svg$foreignObject = $gren_lang$browser$Svg$trustedNode('foreignObject');
var $gren_lang$core$Basics$idiv = _Basics_idiv;
var $gren_lang$browser$Svg$Attributes$width = $gren_lang$browser$VirtualDom$attribute('width');
var $gren_lang$browser$Svg$Attributes$x = $gren_lang$browser$VirtualDom$attribute('x');
var $gren_lang$browser$Svg$Attributes$y = $gren_lang$browser$VirtualDom$attribute('y');
var $author$project$Page$Triangle$makeInput = function (_v0) {
	var label = _v0.label;
	var idTxt = _v0.idTxt;
	var stepV = _v0.stepV;
	var calcVal = _v0.calcVal;
	var currTxt = _v0.currTxt;
	var updateMsg = _v0.updateMsg;
	var xI = _v0.xI;
	var yI = _v0.yI;
	var w = _v0.w;
	var inputAttArr = [
		$gren_lang$browser$Html$Attributes$id(idTxt),
		$gren_lang$browser$Html$Attributes$type_('number'),
		$gren_lang$browser$Html$Attributes$step(
		$gren_lang$core$String$fromFloat(stepV)),
		A2(
		$gren_lang$browser$Html$Attributes$style,
		'width',
		$gren_lang$core$String$fromInt(w - 55) + 'px')
	];
	return A2(
		$gren_lang$browser$Svg$foreignObject,
		[
			$gren_lang$browser$Svg$Attributes$width(
			$gren_lang$core$String$fromInt(w)),
			$gren_lang$browser$Svg$Attributes$height('60'),
			$gren_lang$browser$Svg$Attributes$x(
			$gren_lang$core$String$fromInt(xI - ((w / 2) | 0))),
			$gren_lang$browser$Svg$Attributes$y(
			$gren_lang$core$String$fromInt(yI - 30))
		],
		[
			A2(
			$gren_lang$browser$Html$div,
			[],
			[
				$gren_lang$browser$Html$text(label),
				$gren_lang$browser$Html$text('         '),
				A2(
				$gren_lang$browser$Html$br,
				[],
				[]),
				function () {
				if (calcVal.$ === 'Just') {
					var t = calcVal.a;
					return A2(
						$gren_lang$browser$Html$input,
						_Utils_ap(
							[
								$gren_lang$browser$Html$Attributes$value(
								$gren_lang$core$String$fromFloat(t)),
								$gren_lang$browser$Html$Attributes$readonly(true)
							],
							inputAttArr),
						[]);
				} else {
					return A2(
						$gren_lang$browser$Html$input,
						_Utils_ap(
							[
								$gren_lang$browser$Html$Attributes$value(currTxt),
								$gren_lang$browser$Html$Events$onInput(updateMsg)
							],
							inputAttArr),
						[]);
				}
			}(),
				function () {
				if (A2($author$project$Page$Triangle$getButtonExists, calcVal, currTxt)) {
					if (calcVal.$ === 'Just') {
						var t = calcVal.a;
						return A2(
							$gren_lang$browser$Html$button,
							[
								$gren_lang$browser$Html$Events$onClick(
								$author$project$Page$Triangle$DoCopy(idTxt))
							],
							[
								$gren_lang$browser$Html$text('📋')
							]);
					} else {
						return A2(
							$gren_lang$browser$Html$button,
							[
								$gren_lang$browser$Html$Events$onClick(
								updateMsg(''))
							],
							[
								$gren_lang$browser$Html$text('❌')
							]);
					}
				} else {
					return A2(
						$gren_lang$browser$Html$button,
						[
							A2($gren_lang$browser$Html$Attributes$style, 'pointer-events', 'none'),
							A2($gren_lang$browser$Html$Attributes$style, 'visibility', 'hidden'),
							$gren_lang$browser$Html$Attributes$tabindex(-1)
						],
						[
							$gren_lang$browser$Html$text('🔄️')
						]);
				}
			}()
			])
		]);
};
var $gren_lang$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 'Nothing') {
			return $gren_lang$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $gren_lang$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $gren_lang$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $gren_lang$browser$Svg$Attributes$operator = $gren_lang$browser$VirtualDom$attribute('operator');
var $gren_lang$browser$Svg$Attributes$points = $gren_lang$browser$VirtualDom$attribute('points');
var $gren_lang$browser$Svg$polygon = $gren_lang$browser$Svg$trustedNode('polygon');
var $gren_lang$browser$Svg$Attributes$result = $gren_lang$browser$VirtualDom$attribute('result');
var $gren_lang$core$Math$sin = _Math_sin;
var $gren_lang$browser$Svg$Attributes$stdDeviation = $gren_lang$browser$VirtualDom$attribute('stdDeviation');
var $gren_lang$browser$Svg$Attributes$stroke = $gren_lang$browser$VirtualDom$attribute('stroke');
var $gren_lang$browser$Svg$Attributes$strokeLinejoin = $gren_lang$browser$VirtualDom$attribute('stroke-linejoin');
var $gren_lang$browser$Svg$Attributes$strokeWidth = $gren_lang$browser$VirtualDom$attribute('stroke-width');
var $gren_lang$browser$Svg$svg = $gren_lang$browser$Svg$trustedNode('svg');
var $gren_lang$core$Math$tan = _Math_tan;
var $author$project$Page$Triangle$undegrees = function (rad) {
	return (rad * 180) / $gren_lang$core$Math$pi;
};
var $author$project$Page$Triangle$view = function (model) {
	var parsedModel = {
		a: $gren_lang$core$String$toFloat(model.a),
		b: $gren_lang$core$String$toFloat(model.b),
		c: $gren_lang$core$String$toFloat(model.c),
		theta: $gren_lang$core$String$toFloat(model.theta)
	};
	var error = A2(
		$gren_lang$core$Result$andThen,
		function (_v19) {
			var _v20 = A3($gren_lang$core$Maybe$map2, $gren_lang$core$Basics$gt, parsedModel.b, parsedModel.c);
			if ((_v20.$ === 'Just') && _v20.a) {
				return $gren_lang$core$Result$Err('error: B should be less than C');
			} else {
				return $gren_lang$core$Result$Ok(
					{});
			}
		},
		A2(
			$gren_lang$core$Result$andThen,
			function (_v17) {
				var _v18 = A3($gren_lang$core$Maybe$map2, $gren_lang$core$Basics$gt, parsedModel.a, parsedModel.c);
				if ((_v18.$ === 'Just') && _v18.a) {
					return $gren_lang$core$Result$Err('error: A should be less than C');
				} else {
					return $gren_lang$core$Result$Ok(
						{});
				}
			},
			A2(
				$gren_lang$core$Result$andThen,
				function (_v15) {
					var _v16 = parsedModel.theta;
					if (_v16.$ === 'Just') {
						var theta = _v16.a;
						return ((theta <= 0) || (theta >= 90)) ? $gren_lang$core$Result$Err('error: θ should be between 0 and 90 degrees') : $gren_lang$core$Result$Ok(
							{});
					} else {
						return $gren_lang$core$Result$Ok(
							{});
					}
				},
				$gren_lang$core$Result$Ok(
					{}))));
	var formatF = function (value) {
		if (error.$ === 'Err') {
			return $gren_lang$core$Maybe$Just(0 / 0);
		} else {
			return $gren_lang$core$Maybe$Just(
				$gren_lang$core$Math$round(value * 1000000) / 1000000);
		}
	};
	var emptyResult = {a: $gren_lang$core$Maybe$Nothing, b: $gren_lang$core$Maybe$Nothing, c: $gren_lang$core$Maybe$Nothing, theta: $gren_lang$core$Maybe$Nothing};
	var res = function () {
		_v1$6:
		while (true) {
			if (parsedModel.a.$ === 'Just') {
				if (parsedModel.b.$ === 'Just') {
					if ((parsedModel.c.$ === 'Nothing') && (parsedModel.theta.$ === 'Nothing')) {
						var a = parsedModel.a.a;
						var b = parsedModel.b.a;
						var _v2 = parsedModel.c;
						var _v3 = parsedModel.theta;
						var theta = $gren_lang$core$Math$atan(a / b);
						var c = $gren_lang$core$Math$sqrt((a * a) + (b * b));
						return _Utils_update(
							emptyResult,
							{
								c: formatF(c),
								theta: formatF(
									$author$project$Page$Triangle$undegrees(theta))
							});
					} else {
						break _v1$6;
					}
				} else {
					if (parsedModel.c.$ === 'Just') {
						if (parsedModel.theta.$ === 'Nothing') {
							var a = parsedModel.a.a;
							var _v4 = parsedModel.b;
							var c = parsedModel.c.a;
							var _v5 = parsedModel.theta;
							var theta = $gren_lang$core$Math$asin(a / c);
							var b = c * $gren_lang$core$Math$cos(theta);
							return _Utils_update(
								emptyResult,
								{
									b: formatF(b),
									theta: formatF(
										$author$project$Page$Triangle$undegrees(theta))
								});
						} else {
							break _v1$6;
						}
					} else {
						if (parsedModel.theta.$ === 'Just') {
							var a = parsedModel.a.a;
							var _v6 = parsedModel.b;
							var _v7 = parsedModel.c;
							var theta_d = parsedModel.theta.a;
							var theta = $gren_lang$core$Math$degrees(theta_d);
							var c = a / $gren_lang$core$Math$sin(theta);
							var b = a / $gren_lang$core$Math$tan(theta);
							return _Utils_update(
								emptyResult,
								{
									b: formatF(b),
									c: formatF(c)
								});
						} else {
							break _v1$6;
						}
					}
				}
			} else {
				if (parsedModel.b.$ === 'Just') {
					if (parsedModel.c.$ === 'Just') {
						if (parsedModel.theta.$ === 'Nothing') {
							var _v8 = parsedModel.a;
							var b = parsedModel.b.a;
							var c = parsedModel.c.a;
							var _v9 = parsedModel.theta;
							var theta = $gren_lang$core$Math$acos(b / c);
							var a = c * $gren_lang$core$Math$sin(theta);
							return _Utils_update(
								emptyResult,
								{
									a: formatF(a),
									theta: formatF(
										$author$project$Page$Triangle$undegrees(theta))
								});
						} else {
							break _v1$6;
						}
					} else {
						if (parsedModel.theta.$ === 'Just') {
							var _v10 = parsedModel.a;
							var b = parsedModel.b.a;
							var _v11 = parsedModel.c;
							var theta_d = parsedModel.theta.a;
							var theta = $gren_lang$core$Math$degrees(theta_d);
							var c = b / $gren_lang$core$Math$cos(theta);
							var a = b * $gren_lang$core$Math$tan(theta);
							return _Utils_update(
								emptyResult,
								{
									a: formatF(a),
									c: formatF(c)
								});
						} else {
							break _v1$6;
						}
					}
				} else {
					if ((parsedModel.c.$ === 'Just') && (parsedModel.theta.$ === 'Just')) {
						var _v12 = parsedModel.a;
						var _v13 = parsedModel.b;
						var c = parsedModel.c.a;
						var theta_d = parsedModel.theta.a;
						var theta = $gren_lang$core$Math$degrees(theta_d);
						var b = c * $gren_lang$core$Math$cos(theta);
						var a = c * $gren_lang$core$Math$sin(theta);
						return _Utils_update(
							emptyResult,
							{
								a: formatF(a),
								b: formatF(b)
							});
					} else {
						break _v1$6;
					}
				}
			}
		}
		return emptyResult;
	}();
	return {
		body: [
			A2(
			$gren_lang$browser$Html$a,
			[
				$gren_lang$browser$Html$Attributes$class('left'),
				$gren_lang$browser$Html$Attributes$href('#/')
			],
			[
				$gren_lang$browser$Html$text('Home')
			]),
			A2(
			$gren_lang$browser$Html$div,
			[
				$gren_lang$browser$Html$Attributes$id('triangle'),
				$gren_lang$browser$Html$Attributes$class('center')
			],
			[
				A2(
				$gren_lang$browser$Html$h1,
				[],
				[
					$gren_lang$browser$Html$text('Triangles')
				]),
				A2(
				$gren_lang$browser$Html$br,
				[],
				[]),
				A2(
				$gren_lang$browser$Svg$svg,
				[
					$gren_lang$browser$Svg$Attributes$width('600'),
					$gren_lang$browser$Svg$Attributes$height('400')
				],
				[
					A2(
					$gren_lang$browser$Svg$filter,
					[
						$gren_lang$browser$Html$Attributes$id('inset-shadow')
					],
					[
						A2(
						$gren_lang$browser$Svg$feOffset,
						[
							$gren_lang$browser$Svg$Attributes$dx('0'),
							$gren_lang$browser$Svg$Attributes$dy('1')
						],
						[]),
						A2(
						$gren_lang$browser$Svg$feGaussianBlur,
						[
							$gren_lang$browser$Svg$Attributes$stdDeviation('2'),
							$gren_lang$browser$Svg$Attributes$result('offset-blur')
						],
						[]),
						A2(
						$gren_lang$browser$Svg$feComposite,
						[
							$gren_lang$browser$Svg$Attributes$operator('out'),
							$gren_lang$browser$Svg$Attributes$in_('SourceGraphic'),
							$gren_lang$browser$Svg$Attributes$in2('offset-blur'),
							$gren_lang$browser$Svg$Attributes$result('inverse')
						],
						[]),
						A2(
						$gren_lang$browser$Svg$feFlood,
						[
							$gren_lang$browser$Svg$Attributes$floodColor('black'),
							$gren_lang$browser$Svg$Attributes$floodOpacity('0.4'),
							$gren_lang$browser$Svg$Attributes$result('color')
						],
						[]),
						A2(
						$gren_lang$browser$Svg$feComposite,
						[
							$gren_lang$browser$Svg$Attributes$operator('in'),
							$gren_lang$browser$Svg$Attributes$in_('color'),
							$gren_lang$browser$Svg$Attributes$in2('inverse'),
							$gren_lang$browser$Svg$Attributes$result('shadow')
						],
						[]),
						A2(
						$gren_lang$browser$Svg$feComposite,
						[
							$gren_lang$browser$Svg$Attributes$operator('over'),
							$gren_lang$browser$Svg$Attributes$in_('shadow'),
							$gren_lang$browser$Svg$Attributes$in2('SourceGraphic')
						],
						[])
					]),
					A2(
					$gren_lang$browser$Svg$polygon,
					[
						$gren_lang$browser$Svg$Attributes$fill('var(--background)'),
						$gren_lang$browser$Svg$Attributes$stroke('var(--background)'),
						$gren_lang$browser$Svg$Attributes$points(
						A2($author$project$Page$Triangle$getButtonExists, res.a, model.a) ? '150,50 590,335 150,335 150,230 197,230 200,227 200,188 197,185 150,185' : '150,50 590,335 150,335 150,230 162,230 165,227 165,188 162,185 150,185'),
						A2($gren_lang$browser$Html$Attributes$style, 'filter', 'url(#inset-shadow)'),
						$gren_lang$browser$Svg$Attributes$strokeLinejoin('round'),
						$gren_lang$browser$Svg$Attributes$strokeWidth('5')
					],
					[]),
					$author$project$Page$Triangle$makeInput(
					{calcVal: res.a, currTxt: model.a, idTxt: 'a', label: 'A', stepV: 0.1, updateMsg: $author$project$Page$Triangle$UpdateA, w: 200, xI: 100, yI: 200}),
					$author$project$Page$Triangle$makeInput(
					{calcVal: res.b, currTxt: model.b, idTxt: 'b', label: 'B', stepV: 0.1, updateMsg: $author$project$Page$Triangle$UpdateB, w: 200, xI: 370, yI: 400 - 30}),
					$author$project$Page$Triangle$makeInput(
					{calcVal: res.c, currTxt: model.c, idTxt: 'c', label: 'C', stepV: 0.1, updateMsg: $author$project$Page$Triangle$UpdateC, w: 200, xI: 450, yI: 150}),
					$author$project$Page$Triangle$makeInput(
					{calcVal: res.theta, currTxt: model.theta, idTxt: 'theta', label: 'θ', stepV: 0.1, updateMsg: $author$project$Page$Triangle$UpdateTheta, w: 150, xI: 475, yI: 310})
				]),
				function () {
				if (error.$ === 'Err') {
					var e = error.a;
					return A2(
						$gren_lang$browser$Html$div,
						[
							$gren_lang$browser$Html$Attributes$class('center')
						],
						[
							$gren_lang$browser$Html$text(e)
						]);
				} else {
					return $gren_lang$browser$Html$text('');
				}
			}()
			])
		],
		title: 'Triangles'
	};
};
var $author$project$Page$Truss$ToggleTitleEdit = {$: 'ToggleTitleEdit'};
var $author$project$Page$Truss$UpdateChordDoubling = function (a) {
	return {$: 'UpdateChordDoubling', a: a};
};
var $author$project$Page$Truss$UpdateChordGap = function (a) {
	return {$: 'UpdateChordGap', a: a};
};
var $author$project$Page$Truss$UpdateChordHeight = function (a) {
	return {$: 'UpdateChordHeight', a: a};
};
var $author$project$Page$Truss$UpdateChordLen = function (a) {
	return {$: 'UpdateChordLen', a: a};
};
var $author$project$Page$Truss$UpdateNextCount = function (a) {
	return {$: 'UpdateNextCount', a: a};
};
var $author$project$Page$Truss$UpdateNextWeb = function (a) {
	return {$: 'UpdateNextWeb', a: a};
};
var $author$project$Page$Truss$UpdateRoof = function (a) {
	return {$: 'UpdateRoof', a: a};
};
var $author$project$Page$Truss$UpdateStartCount = function (a) {
	return {$: 'UpdateStartCount', a: a};
};
var $author$project$Page$Truss$UpdateStartWeb = function (a) {
	return {$: 'UpdateStartWeb', a: a};
};
var $author$project$Page$Truss$UpdateTitle = function (a) {
	return {$: 'UpdateTitle', a: a};
};
var $author$project$Page$Truss$UpdateWeb = function (a) {
	return {$: 'UpdateWeb', a: a};
};
var $author$project$Page$Truss$UpdateWebAngle = function (a) {
	return {$: 'UpdateWebAngle', a: a};
};
var $author$project$Page$Truss$UpdateWebStart = function (a) {
	return {$: 'UpdateWebStart', a: a};
};
var $author$project$Vector2$add = F2(
	function (_v0, _v1) {
		var x1 = _v0.x;
		var y1 = _v0.y;
		var x2 = _v1.x;
		var y2 = _v1.y;
		return {x: x1 + x2, y: y1 + y2};
	});
var $gren_lang$core$Math$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$Page$Truss$canCombineMembers = F2(
	function (name, length) {
		return function (member) {
			return _Utils_eq(member.name, name) && ($gren_lang$core$Math$abs(member.length - length) < 1);
		};
	});
var $author$project$Page$Truss$addMember = F3(
	function (name, length, existing) {
		var _v0 = A2(
			$gren_lang$core$Array$findFirst,
			A2($author$project$Page$Truss$canCombineMembers, name, length),
			existing);
		if (_v0.$ === 'Just') {
			var existingMember = _v0.a;
			return A2(
				$gren_lang$core$Array$map,
				function (member) {
					return _Utils_eq(existingMember, member) ? _Utils_update(
						member,
						{qty: member.qty + 1}) : member;
				},
				existing);
		} else {
			return A2(
				$gren_lang$core$Array$pushLast,
				{length: length, name: name, qty: 1},
				existing);
		}
	});
var $gren_lang$core$Array$isEmpty = function (array) {
	return !$gren_lang$core$Array$length(array);
};
var $author$project$Vector2$dot = F2(
	function (_v0, _v1) {
		var x1 = _v0.x;
		var y1 = _v0.y;
		var x2 = _v1.x;
		var y2 = _v1.y;
		return (x1 * x2) + (y1 * y2);
	});
var $author$project$Vector2$length = function (v) {
	return $gren_lang$core$Math$sqrt(
		A2($author$project$Vector2$dot, v, v));
};
var $gren_lang$core$Math$modBy = _Math_modBy;
var $author$project$Vector2$scale = F2(
	function (a, _v0) {
		var x = _v0.x;
		var y = _v0.y;
		return {x: a * x, y: a * y};
	});
var $author$project$Vector2$mul = F2(
	function (v, a) {
		return A2($author$project$Vector2$scale, a, v);
	});
var $gren_lang$core$Array$pushFirst = F2(
	function (value, array) {
		return A2(
			$gren_lang$core$Array$prefix,
			[value],
			array);
	});
var $author$project$Vector2$v2 = F2(
	function (x, y) {
		return {x: x, y: y};
	});
var $author$project$Page$Truss$calcWebPoints = F3(
	function (dat, currWeb, index) {
		var _v0 = dat;
		var endPoint = _v0.endPoint;
		var webs = _v0.webs;
		var chordDoubling = _v0.chordDoubling;
		var chordVert = _v0.chordVert;
		var mainChordLen = _v0.mainChordLen;
		var _v1 = webs;
		var offsets = _v1.offsets;
		var mainWebWidth = _v1.mainWebWidth;
		var startWebWidth = _v1.startWebWidth;
		var nextWebWidth = _v1.nextWebWidth;
		var startCount = _v1.startCount;
		var nextCount = _v1.nextCount;
		var webWidthToLenMul = _v1.webWidthToLenMul;
		var _v2 = offsets;
		var webOffsetUp = _v2.webOffsetUp;
		var webOffsetUpCd = _v2.webOffsetUpCd;
		var webOffsetDn = _v2.webOffsetDn;
		var webOffsetDnCd = _v2.webOffsetDnCd;
		var webOffsetVec = _v2.webOffsetVec;
		if (_Utils_cmp(currWeb.x, endPoint.x) > 0) {
			return {
				chordDoublingRes: $gren_lang$core$Maybe$Nothing,
				members: A3(
					$author$project$Page$Truss$addMember,
					'Chord',
					mainChordLen,
					A3(
						$author$project$Page$Truss$addMember,
						'Chord',
						mainChordLen,
						[])),
				webLines: [],
				webPoints: []
			};
		} else {
			var webWidth = (_Utils_cmp(index, startCount) < 0) ? startWebWidth : ((_Utils_cmp(index, startCount + nextCount) < 0) ? nextWebWidth : mainWebWidth);
			var webStartGraphicalOffset = ((!index) && (chordDoubling > 0)) ? chordVert : A2($author$project$Vector2$v2, 0, 0);
			var webOffset = A2($author$project$Vector2$mul, webOffsetVec, webWidth);
			var webLen = (_Utils_cmp(index, (chordDoubling * 2) - 1) < 0) ? ($author$project$Vector2$length(webOffsetDnCd) + (webWidthToLenMul * webWidth)) : ($author$project$Vector2$length(webOffsetDn) + (webWidthToLenMul * webWidth));
			var isTop = A2($gren_lang$core$Math$modBy, 2, index) === 1;
			var webOffsetDir = (_Utils_cmp(index, (chordDoubling * 2) - 1) < 0) ? (isTop ? webOffsetDnCd : ((!index) ? A2($author$project$Vector2$add, webOffsetUpCd, chordVert) : webOffsetUpCd)) : (isTop ? webOffsetDn : webOffsetUp);
			var nextCurrWeb = A2(
				$author$project$Vector2$add,
				webOffset,
				A2($author$project$Vector2$add, currWeb, webOffsetDir));
			var nextDat = A3($author$project$Page$Truss$calcWebPoints, dat, nextCurrWeb, index + 1);
			var webPoints = A2($gren_lang$core$Array$pushFirst, currWeb, nextDat.webPoints);
			var isNextWeb = !$gren_lang$core$Array$isEmpty(nextDat.webPoints);
			var webLines = isNextWeb ? A2(
				$gren_lang$core$Array$pushFirst,
				{
					end: nextCurrWeb,
					start: A2(
						$author$project$Vector2$add,
						A2($author$project$Vector2$add, currWeb, webOffset),
						webStartGraphicalOffset)
				},
				A2(
					$gren_lang$core$Array$pushFirst,
					{
						end: A2($author$project$Vector2$add, currWeb, webOffsetDir),
						start: A2($author$project$Vector2$add, currWeb, webStartGraphicalOffset)
					},
					nextDat.webLines)) : [];
			var chordDoublingRes = ((!isNextWeb) && (_Utils_cmp(index, (chordDoubling * 2) - 1) < 1)) ? $gren_lang$core$Maybe$Just(
				{
					end: A2($author$project$Vector2$add, chordVert, endPoint),
					start: chordVert
				}) : (_Utils_eq(index, (chordDoubling * 2) - 1) ? $gren_lang$core$Maybe$Just(
				{
					end: A2($author$project$Vector2$add, currWeb, webOffsetDnCd),
					start: chordVert
				}) : nextDat.chordDoublingRes);
			var addedChordDouble = ((!isNextWeb) && (_Utils_cmp(index, (chordDoubling * 2) - 1) < 1)) ? A3($author$project$Page$Truss$addMember, 'Chord', mainChordLen, nextDat.members) : (_Utils_eq(index, (chordDoubling * 2) - 1) ? A3(
				$author$project$Page$Truss$addMember,
				'Chord',
				$author$project$Vector2$length(
					A2($author$project$Vector2$add, currWeb, webOffsetDir)),
				nextDat.members) : nextDat.members);
			var addedStartWeb = ((_Utils_cmp(index, startCount) < 0) && isNextWeb) ? A3($author$project$Page$Truss$addMember, 'Initial Web', webLen, addedChordDouble) : addedChordDouble;
			var addedNextWeb = ((_Utils_cmp(index, startCount) > -1) && ((_Utils_cmp(index, startCount + nextCount) < 0) && isNextWeb)) ? A3($author$project$Page$Truss$addMember, 'Next Web', webLen, addedStartWeb) : addedStartWeb;
			var addedMainWeb = ((_Utils_cmp(index, startCount + nextCount) > -1) && isNextWeb) ? A3($author$project$Page$Truss$addMember, 'Main Web', webLen, addedNextWeb) : addedNextWeb;
			var members = addedMainWeb;
			return {chordDoublingRes: chordDoublingRes, members: members, webLines: webLines, webPoints: webPoints};
		}
	});
var $author$project$Vector2$sub = F2(
	function (_v0, _v1) {
		var x1 = _v0.x;
		var y1 = _v0.y;
		var x2 = _v1.x;
		var y2 = _v1.y;
		return {x: x1 - x2, y: y1 - y2};
	});
var $author$project$Vector2$distance = F2(
	function (v, w) {
		return $author$project$Vector2$length(
			A2($author$project$Vector2$sub, v, w));
	});
var $author$project$Vector2$divideBy = F2(
	function (a, _v0) {
		var x = _v0.x;
		var y = _v0.y;
		return {x: x / a, y: y / a};
	});
var $author$project$Vector2$div = F2(
	function (v, a) {
		return A2($author$project$Vector2$divideBy, a, v);
	});
var $author$project$Page$Truss$formatF2 = function (_v0) {
	var x = _v0.x;
	var y = _v0.y;
	return {
		x: $gren_lang$core$Math$round(x * 1000000) / 1000000,
		y: $gren_lang$core$Math$round(y * 1000000) / 1000000
	};
};
var $author$project$Page$Truss$formatFs = function (value) {
	return $gren_lang$core$Math$round(value * 100) / 100;
};
var $author$project$Page$Truss$maybeErr = F3(
	function (err, useDefault, orig) {
		if (orig.$ === 'Nothing') {
			return useDefault ? $gren_lang$core$Maybe$Just(err) : $gren_lang$core$Maybe$Nothing;
		} else {
			return orig;
		}
	});
var $author$project$Page$Truss$finishTrussCalc = function (_v0) {
	var chordLen = _v0.chordLen;
	var chordGap = _v0.chordGap;
	var chordHeight = _v0.chordHeight;
	var chordDoubling = _v0.chordDoubling;
	var web = _v0.web;
	var startWeb = _v0.startWeb;
	var startCount = _v0.startCount;
	var nextWeb = _v0.nextWeb;
	var nextCount = _v0.nextCount;
	var roof = _v0.roof;
	var webAngle = _v0.webAngle;
	var webDist = _v0.webStart;
	var webRad = $gren_lang$core$Math$degrees(webAngle);
	var webMax = 90 - $gren_lang$core$Math$abs(roof);
	var roofRad = $gren_lang$core$Math$degrees(roof);
	var trussAlong = A2(
		$author$project$Vector2$v2,
		$gren_lang$core$Math$cos(roofRad),
		$gren_lang$core$Math$sin(roofRad));
	var webStart = A2($author$project$Vector2$mul, trussAlong, webDist);
	var vertGapDist = A2(
		$author$project$Vector2$v2,
		0,
		chordGap / $gren_lang$core$Math$cos(roofRad));
	var webAlongDn = A2(
		$author$project$Vector2$v2,
		$gren_lang$core$Math$cos(roofRad - webRad),
		$gren_lang$core$Math$sin(roofRad - webRad));
	var webOffsetDn = A2(
		$author$project$Vector2$div,
		A2($author$project$Vector2$mul, webAlongDn, chordGap),
		$gren_lang$core$Math$sin(webRad));
	var webOffsetDnCd = A2(
		$author$project$Vector2$div,
		A2($author$project$Vector2$mul, webAlongDn, chordGap - chordHeight),
		$gren_lang$core$Math$sin(webRad));
	var webAlongUp = A2(
		$author$project$Vector2$v2,
		$gren_lang$core$Math$cos(roofRad + webRad),
		$gren_lang$core$Math$sin(roofRad + webRad));
	var webOffsetUp = A2(
		$author$project$Vector2$div,
		A2($author$project$Vector2$mul, webAlongUp, chordGap),
		$gren_lang$core$Math$sin(webRad));
	var webOffsetUpCd = A2(
		$author$project$Vector2$div,
		A2($author$project$Vector2$mul, webAlongUp, chordGap - chordHeight),
		$gren_lang$core$Math$sin(webRad));
	var mainChordLen = chordLen + (chordHeight * $gren_lang$core$Math$tan(roofRad));
	var error = A3(
		$author$project$Page$Truss$maybeErr,
		'web start distance should be positive',
		webDist < 0,
		A3(
			$author$project$Page$Truss$maybeErr,
			'web angle should be positive',
			webAngle < 0,
			A3(
				$author$project$Page$Truss$maybeErr,
				'web angle should be less than ' + ($gren_lang$core$String$fromFloat(webMax) + ' degrees'),
				_Utils_cmp(webAngle, webMax) > 0,
				A3(
					$author$project$Page$Truss$maybeErr,
					'next web count should be positive',
					nextCount < 0,
					A3(
						$author$project$Page$Truss$maybeErr,
						'next web profile width should be positive',
						nextWeb < 0,
						A3(
							$author$project$Page$Truss$maybeErr,
							'initial web count should be positive',
							startCount < 0,
							A3(
								$author$project$Page$Truss$maybeErr,
								'initial web profile width should be positive',
								startWeb < 0,
								A3(
									$author$project$Page$Truss$maybeErr,
									'web profile width should be positive',
									web < 0,
									A3(
										$author$project$Page$Truss$maybeErr,
										'chord doubling count should be positive',
										chordDoubling < 0,
										A3(
											$author$project$Page$Truss$maybeErr,
											'chord height should be positive',
											chordHeight < 0,
											A3(
												$author$project$Page$Truss$maybeErr,
												'gap between chords should be positive',
												chordGap < 0,
												A3($author$project$Page$Truss$maybeErr, 'chord length should be positive', chordLen < 0, $gren_lang$core$Maybe$Nothing))))))))))));
	var endPointLower = A2($author$project$Vector2$mul, trussAlong, chordLen);
	var endPointUpper = A2($author$project$Vector2$add, endPointLower, vertGapDist);
	var chordVert = A2(
		$author$project$Vector2$v2,
		0,
		chordHeight / $gren_lang$core$Math$cos(roofRad));
	var dat = A3(
		$author$project$Page$Truss$calcWebPoints,
		{
			chordDoubling: chordDoubling,
			chordVert: chordVert,
			endPoint: endPointLower,
			mainChordLen: mainChordLen,
			webs: {
				mainWebWidth: web,
				nextCount: nextCount,
				nextWebWidth: nextWeb,
				offsets: {
					webOffsetDn: webOffsetDn,
					webOffsetDnCd: webOffsetDnCd,
					webOffsetUp: webOffsetUp,
					webOffsetUpCd: webOffsetUpCd,
					webOffsetVec: A2(
						$author$project$Vector2$div,
						trussAlong,
						$gren_lang$core$Math$sin(webRad))
				},
				startCount: startCount,
				startWebWidth: startWeb,
				webWidthToLenMul: 1 / $gren_lang$core$Math$tan(webRad)
			}
		},
		webStart,
		0);
	var endDistance = ((A2(
		$gren_lang$core$Math$modBy,
		2,
		$gren_lang$core$Array$length(dat.webPoints)) === 1) ? $author$project$Vector2$distance(endPointLower) : $author$project$Vector2$distance(endPointUpper))(
		A2(
			$gren_lang$core$Maybe$withDefault,
			A2($author$project$Vector2$v2, 0, 9999),
			$gren_lang$core$Array$last(dat.webPoints)));
	if (error.$ === 'Just') {
		var e = error.a;
		return $gren_lang$core$Result$Err(e);
	} else {
		return $gren_lang$core$Result$Ok(
			{
				chordDoublingRes: dat.chordDoublingRes,
				chordVert: chordVert,
				endDistance: $author$project$Page$Truss$formatFs(endDistance),
				lowerChordEnd: endPointLower,
				lowerChordStart: {x: 0.0, y: 0.0},
				members: dat.members,
				upperChordEnd: endPointUpper,
				upperChordStart: vertGapDist,
				webLines: dat.webLines,
				webOffsetDn: $author$project$Page$Truss$formatF2(webOffsetDn),
				webOffsetUp: $author$project$Page$Truss$formatF2(webOffsetUp),
				webPoints: dat.webPoints
			});
	}
};
var $author$project$Page$Truss$calculateTruss = function (model) {
	var parsedModel = {
		chordDoubling: $gren_lang$core$String$toInt(model.chordDoubling),
		chordGap: $gren_lang$core$String$toFloat(model.chordGap),
		chordHeight: $gren_lang$core$String$toFloat(model.chordHeight),
		chordLen: $gren_lang$core$String$toFloat(model.chordLen),
		nextCount: $gren_lang$core$String$toInt(model.nextCount),
		nextWeb: $gren_lang$core$String$toFloat(model.nextWeb),
		roof: $gren_lang$core$String$toFloat(model.roof),
		startCount: $gren_lang$core$String$toInt(model.startCount),
		startWeb: $gren_lang$core$String$toFloat(model.startWeb),
		web: $gren_lang$core$String$toFloat(model.web),
		webAngle: $gren_lang$core$String$toFloat(model.webAngle),
		webStart: $gren_lang$core$String$toFloat(model.webStart)
	};
	_v0$9:
	while (true) {
		_v0$10:
		while (true) {
			_v0$11:
			while (true) {
				_v0$12:
				while (true) {
					_v0$13:
					while (true) {
						if (parsedModel.chordLen.$ === 'Just') {
							if (parsedModel.chordGap.$ === 'Just') {
								if (parsedModel.web.$ === 'Just') {
									if (parsedModel.startWeb.$ === 'Just') {
										if (parsedModel.startCount.$ === 'Just') {
											if (parsedModel.nextWeb.$ === 'Just') {
												if (parsedModel.nextCount.$ === 'Just') {
													if (parsedModel.roof.$ === 'Just') {
														if (parsedModel.webAngle.$ === 'Just') {
															if (parsedModel.webStart.$ === 'Just') {
																if (parsedModel.chordDoubling.$ === 'Nothing') {
																	var chordLen = parsedModel.chordLen.a;
																	var chordGap = parsedModel.chordGap.a;
																	var _v15 = parsedModel.chordDoubling;
																	var web = parsedModel.web.a;
																	var startWeb = parsedModel.startWeb.a;
																	var startCount = parsedModel.startCount.a;
																	var nextWeb = parsedModel.nextWeb.a;
																	var nextCount = parsedModel.nextCount.a;
																	var roof = parsedModel.roof.a;
																	var webAngle = parsedModel.webAngle.a;
																	var webStart = parsedModel.webStart.a;
																	return $author$project$Page$Truss$finishTrussCalc(
																		{
																			chordDoubling: 0,
																			chordGap: chordGap,
																			chordHeight: A2($gren_lang$core$Maybe$withDefault, 0, parsedModel.chordHeight),
																			chordLen: chordLen,
																			nextCount: nextCount,
																			nextWeb: nextWeb,
																			roof: roof,
																			startCount: startCount,
																			startWeb: startWeb,
																			web: web,
																			webAngle: webAngle,
																			webStart: webStart
																		});
																} else {
																	if (parsedModel.chordHeight.$ === 'Just') {
																		var chordLen = parsedModel.chordLen.a;
																		var chordGap = parsedModel.chordGap.a;
																		var chordHeight = parsedModel.chordHeight.a;
																		var chordDoubling = parsedModel.chordDoubling.a;
																		var web = parsedModel.web.a;
																		var startWeb = parsedModel.startWeb.a;
																		var startCount = parsedModel.startCount.a;
																		var nextWeb = parsedModel.nextWeb.a;
																		var nextCount = parsedModel.nextCount.a;
																		var roof = parsedModel.roof.a;
																		var webAngle = parsedModel.webAngle.a;
																		var webStart = parsedModel.webStart.a;
																		return $author$project$Page$Truss$finishTrussCalc(
																			{chordDoubling: chordDoubling, chordGap: chordGap, chordHeight: chordHeight, chordLen: chordLen, nextCount: nextCount, nextWeb: nextWeb, roof: roof, startCount: startCount, startWeb: startWeb, web: web, webAngle: webAngle, webStart: webStart});
																	} else {
																		break _v0$12;
																	}
																}
															} else {
																break _v0$11;
															}
														} else {
															break _v0$10;
														}
													} else {
														break _v0$9;
													}
												} else {
													if (parsedModel.roof.$ === 'Nothing') {
														break _v0$9;
													} else {
														if (parsedModel.webAngle.$ === 'Nothing') {
															break _v0$10;
														} else {
															if (parsedModel.webStart.$ === 'Nothing') {
																break _v0$11;
															} else {
																if (parsedModel.chordHeight.$ === 'Nothing') {
																	break _v0$12;
																} else {
																	var _v26 = parsedModel.nextCount;
																	var _v27 = $gren_lang$core$String$toFloat(model.nextCount);
																	if (_v27.$ === 'Just') {
																		return $gren_lang$core$Result$Err('enter an integral number of next webs');
																	} else {
																		return $gren_lang$core$Result$Err('enter the number of next webs too');
																	}
																}
															}
														}
													}
												}
											} else {
												if (parsedModel.nextCount.$ === 'Nothing') {
													if (parsedModel.roof.$ === 'Just') {
														if (parsedModel.webAngle.$ === 'Just') {
															if (parsedModel.webStart.$ === 'Just') {
																if (parsedModel.chordDoubling.$ === 'Nothing') {
																	var chordLen = parsedModel.chordLen.a;
																	var chordGap = parsedModel.chordGap.a;
																	var _v10 = parsedModel.chordDoubling;
																	var web = parsedModel.web.a;
																	var startWeb = parsedModel.startWeb.a;
																	var startCount = parsedModel.startCount.a;
																	var _v11 = parsedModel.nextWeb;
																	var _v12 = parsedModel.nextCount;
																	var roof = parsedModel.roof.a;
																	var webAngle = parsedModel.webAngle.a;
																	var webStart = parsedModel.webStart.a;
																	return $author$project$Page$Truss$finishTrussCalc(
																		{
																			chordDoubling: 0,
																			chordGap: chordGap,
																			chordHeight: A2($gren_lang$core$Maybe$withDefault, 0, parsedModel.chordHeight),
																			chordLen: chordLen,
																			nextCount: 0,
																			nextWeb: 0,
																			roof: roof,
																			startCount: startCount,
																			startWeb: startWeb,
																			web: web,
																			webAngle: webAngle,
																			webStart: webStart
																		});
																} else {
																	if (parsedModel.chordHeight.$ === 'Just') {
																		var chordLen = parsedModel.chordLen.a;
																		var chordGap = parsedModel.chordGap.a;
																		var chordHeight = parsedModel.chordHeight.a;
																		var chordDoubling = parsedModel.chordDoubling.a;
																		var web = parsedModel.web.a;
																		var startWeb = parsedModel.startWeb.a;
																		var startCount = parsedModel.startCount.a;
																		var _v13 = parsedModel.nextWeb;
																		var _v14 = parsedModel.nextCount;
																		var roof = parsedModel.roof.a;
																		var webAngle = parsedModel.webAngle.a;
																		var webStart = parsedModel.webStart.a;
																		return $author$project$Page$Truss$finishTrussCalc(
																			{chordDoubling: chordDoubling, chordGap: chordGap, chordHeight: chordHeight, chordLen: chordLen, nextCount: 0, nextWeb: 0, roof: roof, startCount: startCount, startWeb: startWeb, web: web, webAngle: webAngle, webStart: webStart});
																	} else {
																		break _v0$12;
																	}
																}
															} else {
																break _v0$11;
															}
														} else {
															break _v0$10;
														}
													} else {
														break _v0$9;
													}
												} else {
													if (parsedModel.roof.$ === 'Nothing') {
														break _v0$9;
													} else {
														if (parsedModel.webAngle.$ === 'Nothing') {
															break _v0$10;
														} else {
															if (parsedModel.webStart.$ === 'Nothing') {
																break _v0$11;
															} else {
																if (parsedModel.chordHeight.$ === 'Nothing') {
																	break _v0$12;
																} else {
																	var _v28 = parsedModel.nextWeb;
																	return $gren_lang$core$Result$Err('enter the size of the next webs');
																}
															}
														}
													}
												}
											}
										} else {
											if (parsedModel.roof.$ === 'Nothing') {
												break _v0$9;
											} else {
												if (parsedModel.webAngle.$ === 'Nothing') {
													break _v0$10;
												} else {
													if (parsedModel.webStart.$ === 'Nothing') {
														break _v0$11;
													} else {
														if (parsedModel.chordHeight.$ === 'Nothing') {
															break _v0$12;
														} else {
															break _v0$13;
														}
													}
												}
											}
										}
									} else {
										if (parsedModel.startCount.$ === 'Nothing') {
											if ((parsedModel.nextWeb.$ === 'Nothing') && (parsedModel.nextCount.$ === 'Nothing')) {
												if (parsedModel.roof.$ === 'Just') {
													if (parsedModel.webAngle.$ === 'Just') {
														if (parsedModel.webStart.$ === 'Just') {
															if (parsedModel.chordDoubling.$ === 'Nothing') {
																var chordLen = parsedModel.chordLen.a;
																var chordGap = parsedModel.chordGap.a;
																var _v1 = parsedModel.chordDoubling;
																var web = parsedModel.web.a;
																var _v2 = parsedModel.startWeb;
																var _v3 = parsedModel.startCount;
																var _v4 = parsedModel.nextWeb;
																var _v5 = parsedModel.nextCount;
																var roof = parsedModel.roof.a;
																var webAngle = parsedModel.webAngle.a;
																var webStart = parsedModel.webStart.a;
																return $author$project$Page$Truss$finishTrussCalc(
																	{
																		chordDoubling: 0,
																		chordGap: chordGap,
																		chordHeight: A2($gren_lang$core$Maybe$withDefault, 0, parsedModel.chordHeight),
																		chordLen: chordLen,
																		nextCount: 0,
																		nextWeb: 0,
																		roof: roof,
																		startCount: 0,
																		startWeb: 0,
																		web: web,
																		webAngle: webAngle,
																		webStart: webStart
																	});
															} else {
																if (parsedModel.chordHeight.$ === 'Just') {
																	var chordLen = parsedModel.chordLen.a;
																	var chordGap = parsedModel.chordGap.a;
																	var chordHeight = parsedModel.chordHeight.a;
																	var chordDoubling = parsedModel.chordDoubling.a;
																	var web = parsedModel.web.a;
																	var _v6 = parsedModel.startWeb;
																	var _v7 = parsedModel.startCount;
																	var _v8 = parsedModel.nextWeb;
																	var _v9 = parsedModel.nextCount;
																	var roof = parsedModel.roof.a;
																	var webAngle = parsedModel.webAngle.a;
																	var webStart = parsedModel.webStart.a;
																	return $author$project$Page$Truss$finishTrussCalc(
																		{chordDoubling: chordDoubling, chordGap: chordGap, chordHeight: chordHeight, chordLen: chordLen, nextCount: 0, nextWeb: 0, roof: roof, startCount: 0, startWeb: 0, web: web, webAngle: webAngle, webStart: webStart});
																} else {
																	break _v0$12;
																}
															}
														} else {
															break _v0$11;
														}
													} else {
														break _v0$10;
													}
												} else {
													break _v0$9;
												}
											} else {
												if (parsedModel.roof.$ === 'Nothing') {
													break _v0$9;
												} else {
													if (parsedModel.webAngle.$ === 'Nothing') {
														break _v0$10;
													} else {
														if (parsedModel.webStart.$ === 'Nothing') {
															break _v0$11;
														} else {
															if (parsedModel.chordHeight.$ === 'Nothing') {
																break _v0$12;
															} else {
																break _v0$13;
															}
														}
													}
												}
											}
										} else {
											if (parsedModel.roof.$ === 'Nothing') {
												break _v0$9;
											} else {
												if (parsedModel.webAngle.$ === 'Nothing') {
													break _v0$10;
												} else {
													if (parsedModel.webStart.$ === 'Nothing') {
														break _v0$11;
													} else {
														if (parsedModel.chordHeight.$ === 'Nothing') {
															break _v0$12;
														} else {
															var _v25 = parsedModel.startWeb;
															return $gren_lang$core$Result$Err('enter the size of the initial webs');
														}
													}
												}
											}
										}
									}
								} else {
									var _v18 = parsedModel.web;
									return $gren_lang$core$Result$Err('enter the width of the web profile');
								}
							} else {
								var _v17 = parsedModel.chordGap;
								return $gren_lang$core$Result$Err('enter the gap between the chords');
							}
						} else {
							var _v16 = parsedModel.chordLen;
							return $gren_lang$core$Result$Err('enter the length of the chord');
						}
					}
					var _v23 = parsedModel.startCount;
					var _v24 = $gren_lang$core$String$toFloat(model.startCount);
					if (_v24.$ === 'Just') {
						return $gren_lang$core$Result$Err('enter an integral number of initial webs');
					} else {
						return $gren_lang$core$Result$Err('enter the number of initial webs too');
					}
				}
				var _v22 = parsedModel.chordHeight;
				return $gren_lang$core$Result$Err('enter the height of the chord profile too');
			}
			var _v21 = parsedModel.webStart;
			return $gren_lang$core$Result$Err('enter the web start distance');
		}
		var _v20 = parsedModel.webAngle;
		return $gren_lang$core$Result$Err('enter the angle that you want the webs to be at');
	}
	var _v19 = parsedModel.roof;
	return $gren_lang$core$Result$Err('enter the angle of the roof');
};
var $gren_lang$browser$Svg$line = $gren_lang$browser$Svg$trustedNode('line');
var $gren_lang$browser$Svg$Attributes$x1 = $gren_lang$browser$VirtualDom$attribute('x1');
var $gren_lang$browser$Svg$Attributes$x2 = $gren_lang$browser$VirtualDom$attribute('x2');
var $gren_lang$browser$Svg$Attributes$y1 = $gren_lang$browser$VirtualDom$attribute('y1');
var $gren_lang$browser$Svg$Attributes$y2 = $gren_lang$browser$VirtualDom$attribute('y2');
var $author$project$Page$Truss$doLine = F3(
	function (sw, start, end) {
		return A2(
			$gren_lang$browser$Svg$line,
			[
				$gren_lang$browser$Svg$Attributes$x1(
				$gren_lang$core$String$fromFloat(start.x)),
				$gren_lang$browser$Svg$Attributes$y1(
				$gren_lang$core$String$fromFloat(start.y)),
				$gren_lang$browser$Svg$Attributes$x2(
				$gren_lang$core$String$fromFloat(end.x)),
				$gren_lang$browser$Svg$Attributes$y2(
				$gren_lang$core$String$fromFloat(end.y)),
				$gren_lang$browser$Svg$Attributes$stroke('var(--text)'),
				$gren_lang$browser$Svg$Attributes$strokeWidth(
				$gren_lang$core$String$fromFloat(sw))
			],
			[]);
	});
var $author$project$Page$Truss$lines = F2(
	function (sw, linesArr) {
		return A2(
			$gren_lang$core$Array$map,
			function (ls) {
				return A3($author$project$Page$Truss$doLine, sw, ls.start, ls.end);
			},
			linesArr);
	});
var $author$project$Page$Truss$makeInput = F5(
	function (label, idTxt, stepV, currTxt, updateMsg) {
		return A2(
			$gren_lang$browser$Html$div,
			[],
			[
				$gren_lang$browser$Html$text(label),
				A2(
				$gren_lang$browser$Html$br,
				[],
				[]),
				$gren_lang$browser$Html$text('         '),
				A2(
				$gren_lang$browser$Html$input,
				[
					$gren_lang$browser$Html$Attributes$value(currTxt),
					$gren_lang$browser$Html$Events$onInput(updateMsg),
					$gren_lang$browser$Html$Attributes$id(idTxt),
					$gren_lang$browser$Html$Attributes$type_('number'),
					$gren_lang$browser$Html$Attributes$step(
					$gren_lang$core$String$fromFloat(stepV))
				],
				[]),
				$gren_lang$core$String$isEmpty(currTxt) ? A2(
				$gren_lang$browser$Html$button,
				[
					A2($gren_lang$browser$Html$Attributes$style, 'pointer-events', 'none'),
					A2($gren_lang$browser$Html$Attributes$style, 'opacity', '0'),
					$gren_lang$browser$Html$Attributes$tabindex(-1)
				],
				[
					$gren_lang$browser$Html$text('❌')
				]) : A2(
				$gren_lang$browser$Html$button,
				[
					$gren_lang$browser$Html$Events$onClick(
					updateMsg(''))
				],
				[
					$gren_lang$browser$Html$text('❌')
				])
			]);
	});
var $author$project$Page$Truss$DoCopy = function (a) {
	return {$: 'DoCopy', a: a};
};
var $author$project$Page$Truss$makeOutput = F3(
	function (label, idTxt, calc) {
		return A2(
			$gren_lang$browser$Html$div,
			[],
			[
				$gren_lang$browser$Html$text(label),
				A2(
				$gren_lang$browser$Html$br,
				[],
				[]),
				$gren_lang$browser$Html$text('         '),
				A2(
				$gren_lang$browser$Html$input,
				[
					$gren_lang$browser$Html$Attributes$value(
					$gren_lang$core$String$fromFloat(calc)),
					$gren_lang$browser$Html$Attributes$readonly(true),
					$gren_lang$browser$Html$Attributes$id(idTxt),
					$gren_lang$browser$Html$Attributes$type_('number')
				],
				[]),
				A2(
				$gren_lang$browser$Html$button,
				[
					$gren_lang$browser$Html$Events$onClick(
					$author$project$Page$Truss$DoCopy(idTxt))
				],
				[
					$gren_lang$browser$Html$text('📋')
				])
			]);
	});
var $author$project$Page$Truss$makeOutputLine = F3(
	function (label, idTxt, _v0) {
		var x = _v0.x;
		var y = _v0.y;
		var idY = idTxt + '-y';
		var idX = idTxt + '-x';
		return A2(
			$gren_lang$browser$Html$div,
			[],
			[
				$gren_lang$browser$Html$text(label),
				A2(
				$gren_lang$browser$Html$br,
				[],
				[]),
				$gren_lang$browser$Html$text('         '),
				A2(
				$gren_lang$browser$Html$input,
				[
					$gren_lang$browser$Html$Attributes$value(
					$gren_lang$core$String$fromFloat(x)),
					$gren_lang$browser$Html$Attributes$readonly(true),
					$gren_lang$browser$Html$Attributes$id(idX),
					$gren_lang$browser$Html$Attributes$type_('number')
				],
				[]),
				A2(
				$gren_lang$browser$Html$button,
				[
					$gren_lang$browser$Html$Events$onClick(
					$author$project$Page$Truss$DoCopy(idX))
				],
				[
					$gren_lang$browser$Html$text('📋')
				]),
				A2(
				$gren_lang$browser$Html$input,
				[
					$gren_lang$browser$Html$Attributes$value(
					$gren_lang$core$String$fromFloat(y)),
					$gren_lang$browser$Html$Attributes$readonly(true),
					$gren_lang$browser$Html$Attributes$id(idY),
					$gren_lang$browser$Html$Attributes$type_('number')
				],
				[]),
				A2(
				$gren_lang$browser$Html$button,
				[
					$gren_lang$browser$Html$Events$onClick(
					$author$project$Page$Truss$DoCopy(idY))
				],
				[
					$gren_lang$browser$Html$text('📋')
				])
			]);
	});
var $author$project$Page$Truss$memberToNum = function (member) {
	var _v0 = member.name;
	switch (_v0) {
		case 'Chord':
			return 0;
		case 'Initial Web':
			return 1;
		case 'Next Web':
			return 2;
		case 'Main Web':
			return 3;
		default:
			return 4;
	}
};
var $author$project$Page$Truss$compareMembers = F2(
	function (a, b) {
		var _v0 = A2(
			$gren_lang$core$Basics$compare,
			$author$project$Page$Truss$memberToNum(a),
			$author$project$Page$Truss$memberToNum(b));
		switch (_v0.$) {
			case 'EQ':
				return A2($gren_lang$core$Basics$compare, b.length, a.length);
			case 'LT':
				return $gren_lang$core$Basics$LT;
			default:
				return $gren_lang$core$Basics$GT;
		}
	});
var $gren_lang$core$Array$sortWith = _Array_sortWith;
var $gren_lang$browser$Html$table = $gren_lang$browser$Html$node('table');
var $gren_lang$browser$Html$tbody = $gren_lang$browser$Html$node('tbody');
var $gren_lang$browser$Html$td = $gren_lang$browser$Html$node('td');
var $gren_lang$browser$Html$th = $gren_lang$browser$Html$node('th');
var $gren_lang$browser$Html$thead = $gren_lang$browser$Html$node('thead');
var $gren_lang$browser$Html$tr = $gren_lang$browser$Html$node('tr');
var $author$project$Page$Truss$makeOutputTable = function (members) {
	return A2(
		$gren_lang$browser$Html$table,
		[
			A2($gren_lang$browser$Html$Attributes$style, 'margin-left', 'auto'),
			A2($gren_lang$browser$Html$Attributes$style, 'margin-right', 'auto')
		],
		[
			A2(
			$gren_lang$browser$Html$thead,
			[],
			[
				A2(
				$gren_lang$browser$Html$tr,
				[],
				[
					A2(
					$gren_lang$browser$Html$th,
					[],
					[
						$gren_lang$browser$Html$text('Member Type')
					]),
					A2(
					$gren_lang$browser$Html$th,
					[],
					[
						$gren_lang$browser$Html$text('Length')
					]),
					A2(
					$gren_lang$browser$Html$th,
					[],
					[
						$gren_lang$browser$Html$text('Qty')
					])
				])
			]),
			A2(
			$gren_lang$browser$Html$tbody,
			[],
			A2(
				$gren_lang$core$Array$map,
				function (_v0) {
					var name = _v0.name;
					var length = _v0.length;
					var qty = _v0.qty;
					return A2(
						$gren_lang$browser$Html$tr,
						[],
						[
							A2(
							$gren_lang$browser$Html$td,
							[],
							[
								$gren_lang$browser$Html$text(name)
							]),
							A2(
							$gren_lang$browser$Html$td,
							[],
							[
								$gren_lang$browser$Html$text(
								$gren_lang$core$String$fromFloat(
									$author$project$Page$Truss$formatFs(length)))
							]),
							A2(
							$gren_lang$browser$Html$td,
							[],
							[
								$gren_lang$browser$Html$text(
								$gren_lang$core$String$fromInt(qty))
							])
						]);
				},
				A2($gren_lang$core$Array$sortWith, $author$project$Page$Truss$compareMembers, members)))
		]);
};
var $gren_lang$browser$Svg$Attributes$viewBox = $gren_lang$browser$VirtualDom$attribute('viewBox');
var $author$project$Page$Truss$view = function (model) {
	return {
		body: [
			A2(
			$gren_lang$browser$Html$a,
			[
				$gren_lang$browser$Html$Attributes$class('left'),
				$gren_lang$browser$Html$Attributes$href('#/')
			],
			[
				$gren_lang$browser$Html$text('Home')
			]),
			function () {
			if ($gren_lang$core$String$isEmpty(model.roof)) {
				return $gren_lang$browser$Html$text('');
			} else {
				var roofAngle = A2(
					$gren_lang$core$Maybe$withDefault,
					7.5,
					$gren_lang$core$String$toFloat(model.roof));
				var bStr = A2(
					$gren_lang$core$Maybe$withDefault,
					'',
					A2(
						$gren_lang$core$Maybe$map,
						function (c) {
							var b = c * $gren_lang$core$Math$cos(
								$gren_lang$core$Math$degrees(roofAngle));
							var roundB = $gren_lang$core$Math$round(b * 100) / 100;
							return $gren_lang$core$String$fromFloat(roundB);
						},
						$gren_lang$core$String$toFloat(model.chordLen)));
				return A2(
					$gren_lang$browser$Html$a,
					[
						$gren_lang$browser$Html$Attributes$class('right'),
						$gren_lang$browser$Html$Attributes$href(
						'#/triangle?b=' + (bStr + ('&theta=' + $gren_lang$core$String$fromFloat(roofAngle))))
					],
					[
						$gren_lang$browser$Html$text('Roof Triangle')
					]);
			}
		}(),
			A2(
			$gren_lang$browser$Html$div,
			[
				$gren_lang$browser$Html$Attributes$id('truss'),
				$gren_lang$browser$Html$Attributes$class('center')
			],
			[
				A2(
				$gren_lang$browser$Html$h1,
				[],
				[
					model.titleEdit ? A2(
					$gren_lang$browser$Html$input,
					[
						$gren_lang$browser$Html$Attributes$value(model.title),
						$gren_lang$browser$Html$Events$onInput($author$project$Page$Truss$UpdateTitle),
						$gren_lang$browser$Html$Attributes$id('title')
					],
					[]) : $gren_lang$browser$Html$text(model.title),
					$gren_lang$browser$Html$text(' '),
					A2(
					$gren_lang$browser$Html$button,
					[
						$gren_lang$browser$Html$Events$onClick($author$project$Page$Truss$ToggleTitleEdit)
					],
					[
						$gren_lang$browser$Html$text('✏️')
					])
				]),
				A2(
				$gren_lang$browser$Html$br,
				[],
				[]),
				A2(
				$gren_lang$browser$Html$div,
				[
					$gren_lang$browser$Html$Attributes$id('truss-inputs'),
					$gren_lang$browser$Html$Attributes$class('center-margin'),
					$gren_lang$browser$Html$Attributes$class('cols-large'),
					A2($gren_lang$browser$Html$Attributes$style, 'max-width', '60em')
				],
				[
					A5($author$project$Page$Truss$makeInput, 'Chord length', 'chord-len', 0.5, model.chordLen, $author$project$Page$Truss$UpdateChordLen),
					A5($author$project$Page$Truss$makeInput, 'Gap between chords', 'chord-gap', 0.5, model.chordGap, $author$project$Page$Truss$UpdateChordGap),
					A5($author$project$Page$Truss$makeInput, 'Chord height', 'chord-height', 0.5, model.chordHeight, $author$project$Page$Truss$UpdateChordHeight),
					A5($author$project$Page$Truss$makeInput, 'Chord doubling count', 'chord-doubling', 1, model.chordDoubling, $author$project$Page$Truss$UpdateChordDoubling),
					A5($author$project$Page$Truss$makeInput, 'Roof angle', 'roof', 0.5, model.roof, $author$project$Page$Truss$UpdateRoof),
					A5($author$project$Page$Truss$makeInput, 'Web start distance', 'web-start', 5, model.webStart, $author$project$Page$Truss$UpdateWebStart),
					A5($author$project$Page$Truss$makeInput, 'Web profile width', 'web', 0.5, model.web, $author$project$Page$Truss$UpdateWeb),
					A5($author$project$Page$Truss$makeInput, 'Initial web profile width', 'start-web', 0.5, model.startWeb, $author$project$Page$Truss$UpdateStartWeb),
					A5($author$project$Page$Truss$makeInput, 'Initial web count', 'start-count', 1, model.startCount, $author$project$Page$Truss$UpdateStartCount),
					A5($author$project$Page$Truss$makeInput, 'Next web profile width', 'next-web', 0.5, model.nextWeb, $author$project$Page$Truss$UpdateNextWeb),
					A5($author$project$Page$Truss$makeInput, 'Next web count', 'next-count', 1, model.nextCount, $author$project$Page$Truss$UpdateNextCount),
					A5($author$project$Page$Truss$makeInput, 'Web angle', 'web-angle', 0.1, model.webAngle, $author$project$Page$Truss$UpdateWebAngle)
				]),
				A2(
				$gren_lang$browser$Html$hr,
				[],
				[]),
				function () {
				var _v0 = $author$project$Page$Truss$calculateTruss(model);
				if (_v0.$ === 'Err') {
					var e = _v0.a;
					return A2(
						$gren_lang$browser$Html$div,
						[
							$gren_lang$browser$Html$Attributes$class('center')
						],
						[
							$gren_lang$browser$Html$text(e)
						]);
				} else {
					var _v1 = _v0.a;
					var endDistance = _v1.endDistance;
					var webPoints = _v1.webPoints;
					var webLines = _v1.webLines;
					var lowerChordStart = _v1.lowerChordStart;
					var upperChordStart = _v1.upperChordStart;
					var lowerChordEnd = _v1.lowerChordEnd;
					var upperChordEnd = _v1.upperChordEnd;
					var webOffsetDn = _v1.webOffsetDn;
					var webOffsetUp = _v1.webOffsetUp;
					var chordDoublingRes = _v1.chordDoublingRes;
					var chordVert = _v1.chordVert;
					var members = _v1.members;
					var trussWidth = upperChordEnd.x;
					var isDown = _Utils_cmp(upperChordEnd.y, upperChordStart.y) < 0;
					var trussHeight = isDown ? (((upperChordStart.y - lowerChordEnd.y) + chordVert.y) + chordVert.y) : ((upperChordEnd.y + chordVert.y) + chordVert.y);
					var assumedWidth = 1000.0;
					var sw = (trussWidth * 1.0) / assumedWidth;
					var changeCoords = function (_v5) {
						var x = _v5.x;
						var y = _v5.y;
						return {
							x: x + sw,
							y: isDown ? (((upperChordStart.y - y) + sw) + chordVert.y) : (((trussHeight - y) + sw) - chordVert.y)
						};
					};
					var webLinesMap = A2(
						$gren_lang$core$Array$map,
						function (_v4) {
							var start = _v4.start;
							var end = _v4.end;
							return {
								end: changeCoords(end),
								start: changeCoords(start)
							};
						},
						webLines);
					var vbHeight = trussHeight + (sw * 2);
					var vbWidth = trussWidth + (sw * 2);
					return A2(
						$gren_lang$browser$Html$div,
						[
							$gren_lang$browser$Html$Attributes$class('center')
						],
						[
							A3($author$project$Page$Truss$makeOutput, 'End distance', 'end-distance', endDistance),
							A3($author$project$Page$Truss$makeOutputLine, 'Up distance', 'up-distance', webOffsetUp),
							A3($author$project$Page$Truss$makeOutputLine, 'Dn distance', 'dn-distance', webOffsetDn),
							$author$project$Page$Truss$makeOutputTable(members),
							A2(
							$gren_lang$browser$Svg$svg,
							[
								A2($gren_lang$browser$Html$Attributes$style, 'width', 'clamp(75%, 1000px, 100%)'),
								$gren_lang$browser$Svg$Attributes$viewBox(
								'0 0 ' + ($gren_lang$core$String$fromFloat(vbWidth) + (' ' + $gren_lang$core$String$fromFloat(vbHeight))))
							],
							A2(
								$gren_lang$core$Array$pushLast,
								function () {
									if (chordDoublingRes.$ === 'Just') {
										var _v3 = chordDoublingRes.a;
										var start = _v3.start;
										var end = _v3.end;
										return A3(
											$author$project$Page$Truss$doLine,
											sw,
											changeCoords(start),
											changeCoords(end));
									} else {
										return $gren_lang$browser$Html$text('');
									}
								}(),
								A2(
									$author$project$Page$Truss$lines,
									sw,
									A2(
										$gren_lang$core$Array$pushLast,
										{
											end: changeCoords(lowerChordEnd),
											start: changeCoords(lowerChordStart)
										},
										A2(
											$gren_lang$core$Array$pushLast,
											{
												end: changeCoords(
													A2($author$project$Vector2$sub, lowerChordEnd, chordVert)),
												start: changeCoords(
													A2($author$project$Vector2$sub, lowerChordStart, chordVert))
											},
											A2(
												$gren_lang$core$Array$pushLast,
												{
													end: changeCoords(
														A2($author$project$Vector2$add, upperChordEnd, chordVert)),
													start: changeCoords(
														A2($author$project$Vector2$sub, lowerChordEnd, chordVert))
												},
												A2(
													$gren_lang$core$Array$pushLast,
													{
														end: changeCoords(upperChordEnd),
														start: changeCoords(upperChordStart)
													},
													A2(
														$gren_lang$core$Array$pushLast,
														{
															end: changeCoords(
																A2($author$project$Vector2$add, upperChordEnd, chordVert)),
															start: changeCoords(
																A2($author$project$Vector2$add, upperChordStart, chordVert))
														},
														A2(
															$gren_lang$core$Array$pushLast,
															{
																end: changeCoords(
																	A2($author$project$Vector2$add, upperChordStart, chordVert)),
																start: changeCoords(
																	A2($author$project$Vector2$sub, lowerChordStart, chordVert))
															},
															webLinesMap)))))))))
						]);
				}
			}()
			])
		],
		title: model.title
	};
};
var $author$project$Main$view = function (model) {
	switch (model.$) {
		case 'HomeModel':
			var m = model.a;
			return A2(
				$author$project$Main$mapDocument,
				$author$project$Main$HomeMsg,
				$author$project$Page$Home$view(m));
		case 'GalvHoleModel':
			var m = model.a;
			return A2(
				$author$project$Main$mapDocument,
				$author$project$Main$GalvHoleMsg,
				$author$project$Page$GalvHole$view(m));
		case 'KFactorModel':
			var m = model.a;
			return A2(
				$author$project$Main$mapDocument,
				$author$project$Main$KFactorMsg,
				$author$project$Page$KFactor$view(m));
		case 'TriangleModel':
			var m = model.a;
			return A2(
				$author$project$Main$mapDocument,
				$author$project$Main$TriangleMsg,
				$author$project$Page$Triangle$view(m));
		default:
			var m = model.a;
			return A2(
				$author$project$Main$mapDocument,
				$author$project$Main$TrussMsg,
				$author$project$Page$Truss$view(m));
	}
};
var $author$project$Main$main = $gren_lang$browser$Browser$document(
	{
		init: $author$project$Main$init,
		subscriptions: function (_v0) {
			return $author$project$Main$pageChangedSubscription;
		},
		update: $author$project$Main$update,
		view: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main($gren_lang$core$Json$Decode$string)(0)}});}(this.module ? this.module.exports : this));