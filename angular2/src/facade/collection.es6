import {int,
  isJsObject,
  global} from 'angular2/src/facade/lang';
export var List = global.Array;
export var Map = global.Map;
export var Set = global.Set;
export var StringMap = global.Object;
export class MapWrapper {
  static create() {
    return new Map();
  }
  static clone(m) {
    return new Map(m);
  }
  static createFromStringMap(stringMap) {
    var result = MapWrapper.create();
    for (var prop in stringMap) {
      MapWrapper.set(result, prop, stringMap[prop]);
    }
    return result;
  }
  static createFromPairs(pairs) {
    return new Map(pairs);
  }
  static get(m, k) {
    return m.get(k);
  }
  static set(m, k, v) {
    m.set(k, v);
  }
  static contains(m, k) {
    return m.has(k);
  }
  static forEach(m, fn) {
    m.forEach(fn);
  }
  static size(m) {
    return m.size;
  }
  static delete(m, k) {
    m.delete(k);
  }
  static clear(m) {
    m.clear();
  }
  static iterable(m) {
    return m;
  }
  static keys(m) {
    return m.keys();
  }
  static values(m) {
    return m.values();
  }
}
Object.defineProperty(MapWrapper.clone, "parameters", {get: function() {
    return [[Map]];
  }});
Object.defineProperty(MapWrapper.createFromPairs, "parameters", {get: function() {
    return [[List]];
  }});
export class StringMapWrapper {
  static create() {
    return {};
  }
  static contains(map, key) {
    return map.hasOwnProperty(key);
  }
  static get(map, key) {
    return map.hasOwnProperty(key) ? map[key] : undefined;
  }
  static set(map, key, value) {
    map[key] = value;
  }
  static isEmpty(map) {
    for (var prop in map) {
      return false;
    }
    return true;
  }
  static forEach(map, callback) {
    for (var prop in map) {
      if (map.hasOwnProperty(prop)) {
        callback(map[prop], prop);
      }
    }
  }
  static merge(m1, m2) {
    var m = {};
    for (var attr in m1) {
      if (m1.hasOwnProperty(attr)) {
        m[attr] = m1[attr];
      }
    }
    for (var attr in m2) {
      if (m2.hasOwnProperty(attr)) {
        m[attr] = m2[attr];
      }
    }
    return m;
  }
}
export class ListWrapper {
  static create() {
    return new List();
  }
  static createFixedSize(size) {
    return new List(size);
  }
  static get(m, k) {
    return m[k];
  }
  static set(m, k, v) {
    m[k] = v;
  }
  static clone(array) {
    return array.slice(0);
  }
  static map(array, fn) {
    return array.map(fn);
  }
  static forEach(array, fn) {
    for (var p of array) {
      fn(p);
    }
  }
  static push(array, el) {
    array.push(el);
  }
  static first(array) {
    if (!array)
      return null;
    return array[0];
  }
  static last(array) {
    if (!array || array.length == 0)
      return null;
    return array[array.length - 1];
  }
  static find(list, pred) {
    for (var i = 0; i < list.length; ++i) {
      if (pred(list[i]))
        return list[i];
    }
    return null;
  }
  static reduce(list, fn, init) {
    return list.reduce(fn, init);
  }
  static filter(array, pred) {
    return array.filter(pred);
  }
  static any(list, pred) {
    for (var i = 0; i < list.length; ++i) {
      if (pred(list[i]))
        return true;
    }
    return false;
  }
  static contains(list, el) {
    return list.indexOf(el) !== -1;
  }
  static reversed(array) {
    var a = ListWrapper.clone(array);
    return a.reverse();
  }
  static concat(a, b) {
    return a.concat(b);
  }
  static isList(list) {
    return Array.isArray(list);
  }
  static insert(list, index, value) {
    list.splice(index, 0, value);
  }
  static removeAt(list, index) {
    var res = list[index];
    list.splice(index, 1);
    return res;
  }
  static removeAll(list, items) {
    for (var i = 0; i < items.length; ++i) {
      var index = list.indexOf(items[i]);
      list.splice(index, 1);
    }
  }
  static removeLast(list) {
    return list.pop();
  }
  static remove(list, el) {
    var index = list.indexOf(el);
    if (index > -1) {
      list.splice(index, 1);
      return true;
    }
    return false;
  }
  static clear(list) {
    list.splice(0, list.length);
  }
  static join(list, s) {
    return list.join(s);
  }
  static isEmpty(list) {
    return list.length == 0;
  }
  static fill(list, value, start = 0, end = null) {
    list.fill(value, start, end === null ? undefined : end);
  }
  static equals(a, b) {
    if (a.length != b.length)
      return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i])
        return false;
    }
    return true;
  }
  static slice(l, from, to) {
    return l.slice(from, to);
  }
}
Object.defineProperty(ListWrapper.clone, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(ListWrapper.find, "parameters", {get: function() {
    return [[List], [Function]];
  }});
Object.defineProperty(ListWrapper.reduce, "parameters", {get: function() {
    return [[List], [Function], []];
  }});
Object.defineProperty(ListWrapper.filter, "parameters", {get: function() {
    return [[], [Function]];
  }});
Object.defineProperty(ListWrapper.any, "parameters", {get: function() {
    return [[List], [Function]];
  }});
Object.defineProperty(ListWrapper.contains, "parameters", {get: function() {
    return [[List], []];
  }});
Object.defineProperty(ListWrapper.insert, "parameters", {get: function() {
    return [[], [int], []];
  }});
Object.defineProperty(ListWrapper.removeAt, "parameters", {get: function() {
    return [[], [int]];
  }});
Object.defineProperty(ListWrapper.removeLast, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(ListWrapper.fill, "parameters", {get: function() {
    return [[List], [], [int], [int]];
  }});
Object.defineProperty(ListWrapper.equals, "parameters", {get: function() {
    return [[List], [List]];
  }});
Object.defineProperty(ListWrapper.slice, "parameters", {get: function() {
    return [[List], [int], [int]];
  }});
export function isListLikeIterable(obj) {
  if (!isJsObject(obj))
    return false;
  return ListWrapper.isList(obj) || (!(obj instanceof Map) && Symbol.iterator in obj);
}
export function iterateListLike(obj, fn) {
  for (var item of obj) {
    fn(item);
  }
}
Object.defineProperty(iterateListLike, "parameters", {get: function() {
    return [[], [Function]];
  }});
export class SetWrapper {
  static createFromList(lst) {
    return new Set(lst);
  }
  static has(s, key) {
    return s.has(key);
  }
}
Object.defineProperty(SetWrapper.createFromList, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(SetWrapper.has, "parameters", {get: function() {
    return [[Set], []];
  }});

//# sourceMappingURL=/Users/tbosch/projects/angular2/modules/angular2/src/facade/collection.map

//# sourceMappingURL=./collection.map