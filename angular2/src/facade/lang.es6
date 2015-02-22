var _global = typeof window === 'undefined' ? global : window;
export {_global as global};
export var Type = Function;
export var Math = _global.Math;
export var Date = _global.Date;
var assertionsEnabled_ = typeof assert !== 'undefined';
var int;
if (assertionsEnabled_) {
  _global.assert = assert;
  int = assert.define('int', function(value) {
    return typeof value === 'number' && value % 1 === 0;
  });
} else {
  int = {};
  _global.assert = function() {};
}
export {int};
export class FIELD {
  constructor(definition) {
    this.definition = definition;
  }
}
export class CONST {}
export class ABSTRACT {}
export class IMPLEMENTS {}
export function isPresent(obj) {
  return obj !== undefined && obj !== null;
}
export function isBlank(obj) {
  return obj === undefined || obj === null;
}
export function isString(obj) {
  return typeof obj === "string";
}
export function stringify(token) {
  if (typeof token === 'string') {
    return token;
  }
  if (token === undefined || token === null) {
    return '' + token;
  }
  if (token.name) {
    return token.name;
  }
  return token.toString();
}
export class StringWrapper {
  static fromCharCode(code) {
    return String.fromCharCode(code);
  }
  static charCodeAt(s, index) {
    return s.charCodeAt(index);
  }
  static split(s, regExp) {
    return s.split(regExp.multiple);
  }
  static equals(s, s2) {
    return s === s2;
  }
  static replaceAll(s, from, replace) {
    return s.replace(from.multiple, replace);
  }
  static startsWith(s, start) {
    return s.startsWith(start);
  }
  static substring(s, start, end = null) {
    return s.substring(start, end === null ? undefined : end);
  }
  static replaceAllMapped(s, from, cb) {
    return s.replace(from.multiple, function(...matches) {
      return cb(matches);
    });
  }
  static contains(s, substr) {
    return s.indexOf(substr) != -1;
  }
}
Object.defineProperty(StringWrapper.fromCharCode, "parameters", {get: function() {
    return [[int]];
  }});
Object.defineProperty(StringWrapper.charCodeAt, "parameters", {get: function() {
    return [[assert.type.string], [int]];
  }});
Object.defineProperty(StringWrapper.split, "parameters", {get: function() {
    return [[assert.type.string], [RegExp]];
  }});
Object.defineProperty(StringWrapper.equals, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(StringWrapper.replaceAll, "parameters", {get: function() {
    return [[assert.type.string], [RegExp], [assert.type.string]];
  }});
Object.defineProperty(StringWrapper.startsWith, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(StringWrapper.substring, "parameters", {get: function() {
    return [[assert.type.string], [int], [int]];
  }});
Object.defineProperty(StringWrapper.replaceAllMapped, "parameters", {get: function() {
    return [[assert.type.string], [RegExp], [Function]];
  }});
Object.defineProperty(StringWrapper.contains, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
export class StringJoiner {
  constructor() {
    this.parts = [];
  }
  add(part) {
    this.parts.push(part);
  }
  toString() {
    return this.parts.join("");
  }
}
Object.defineProperty(StringJoiner.prototype.add, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class NumberParseError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }
  toString() {
    return this.message;
  }
}
export class NumberWrapper {
  static parseIntAutoRadix(text) {
    var result = parseInt(text);
    if (isNaN(result)) {
      throw new NumberParseError("Invalid integer literal when parsing " + text);
    }
    return result;
  }
  static parseInt(text, radix) {
    if (radix == 10) {
      if (/^(\-|\+)?[0-9]+$/.test(text)) {
        return parseInt(text, radix);
      }
    } else if (radix == 16) {
      if (/^(\-|\+)?[0-9ABCDEFabcdef]+$/.test(text)) {
        return parseInt(text, radix);
      }
    } else {
      var result = parseInt(text, radix);
      if (!isNaN(result)) {
        return result;
      }
    }
    throw new NumberParseError("Invalid integer literal when parsing " + text + " in base " + radix);
  }
  static parseFloat(text) {
    return parseFloat(text);
  }
  static get NaN() {
    return NaN;
  }
  static isNaN(value) {
    return isNaN(value);
  }
  static isInteger(value) {
    return Number.isInteger(value);
  }
}
Object.defineProperty(NumberWrapper.parseIntAutoRadix, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(NumberWrapper.parseInt, "parameters", {get: function() {
    return [[assert.type.string], [int]];
  }});
Object.defineProperty(NumberWrapper.parseFloat, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
var RegExp;
if (assertionsEnabled_) {
  RegExp = assert.define('RegExp', function(obj) {
    assert(obj).is(assert.structure({
      single: _global.RegExp,
      multiple: _global.RegExp
    }));
  });
} else {
  RegExp = {};
}
export class RegExpWrapper {
  static create(regExpStr, flags = '') {
    flags = flags.replace(/g/g, '');
    return {
      multiple: new _global.RegExp(regExpStr, flags + 'g'),
      single: new _global.RegExp(regExpStr, flags)
    };
  }
  static firstMatch(regExp, input) {
    return input.match(regExp.single);
  }
  static matcher(regExp, input) {
    return {
      re: regExp.multiple,
      input: input
    };
  }
}
Object.defineProperty(RegExpWrapper.create, "parameters", {get: function() {
    return [[], [assert.type.string]];
  }});
export class RegExpMatcherWrapper {
  static next(matcher) {
    return matcher.re.exec(matcher.input);
  }
}
export class FunctionWrapper {
  static apply(fn, posArgs) {
    return fn.apply(null, posArgs);
  }
}
Object.defineProperty(FunctionWrapper.apply, "parameters", {get: function() {
    return [[Function], []];
  }});
export var BaseException = Error;
export function looseIdentical(a, b) {
  return a === b || typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b);
}
export function getMapKey(value) {
  return value;
}
export function normalizeBlank(obj) {
  return isBlank(obj) ? null : obj;
}
export function isJsObject(o) {
  return o !== null && (typeof o === "function" || typeof o === "object");
}
export function assertionsEnabled() {
  return assertionsEnabled_;
}
export function print(obj) {
  if (obj instanceof Error) {
    console.log(obj.stack);
  } else {
    console.log(obj);
  }
}
export var Json = _global.JSON;
export class DateWrapper {
  static fromMillis(ms) {
    return new Date(ms);
  }
  static now() {
    return new Date();
  }
}

//# sourceMappingURL=/Users/tbosch/projects/angular2/modules/angular2/src/facade/lang.map

//# sourceMappingURL=./lang.map