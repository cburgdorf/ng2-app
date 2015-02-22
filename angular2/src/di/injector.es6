import {Map,
  List,
  MapWrapper,
  ListWrapper} from 'angular2/src/facade/collection';
import {Binding,
  BindingBuilder,
  bind} from './binding';
import {ProviderError,
  NoProviderError,
  InvalidBindingError,
  AsyncBindingError,
  CyclicDependencyError,
  InstantiationError} from './exceptions';
import {FunctionWrapper,
  Type,
  isPresent,
  isBlank} from 'angular2/src/facade/lang';
import {Promise,
  PromiseWrapper} from 'angular2/src/facade/async';
import {Key} from './key';
var _constructing = new Object();
class _Waiting {
  constructor(promise) {
    this.promise = promise;
  }
}
Object.defineProperty(_Waiting, "parameters", {get: function() {
    return [[Promise]];
  }});
function _isWaiting(obj) {
  return obj instanceof _Waiting;
}
export class Injector {
  constructor(bindings, {parent = null,
    defaultBindings = false} = {}) {
    var flatten = _flattenBindings(bindings, MapWrapper.create());
    this._bindings = this._createListOfBindings(flatten);
    this._instances = this._createInstances();
    this._parent = parent;
    this._defaultBindings = defaultBindings;
    this._asyncStrategy = new _AsyncInjectorStrategy(this);
    this._syncStrategy = new _SyncInjectorStrategy(this);
  }
  get(token) {
    return this._getByKey(Key.get(token), false, false);
  }
  asyncGet(token) {
    return this._getByKey(Key.get(token), true, false);
  }
  createChild(bindings) {
    return new Injector(bindings, {parent: this});
  }
  _createListOfBindings(flattenBindings) {
    var bindings = ListWrapper.createFixedSize(Key.numberOfKeys + 1);
    MapWrapper.forEach(flattenBindings, (v, keyId) => bindings[keyId] = v);
    return bindings;
  }
  _createInstances() {
    return ListWrapper.createFixedSize(Key.numberOfKeys + 1);
  }
  _getByKey(key, returnPromise, returnLazy) {
    if (returnLazy) {
      return () => this._getByKey(key, returnPromise, false);
    }
    var strategy = returnPromise ? this._asyncStrategy : this._syncStrategy;
    var instance = strategy.readFromCache(key);
    if (isPresent(instance))
      return instance;
    instance = strategy.instantiate(key);
    if (isPresent(instance))
      return instance;
    if (isPresent(this._parent)) {
      return this._parent._getByKey(key, returnPromise, returnLazy);
    }
    throw new NoProviderError(key);
  }
  _resolveDependencies(key, binding, forceAsync) {
    try {
      var getDependency = (d) => this._getByKey(d.key, forceAsync || d.asPromise, d.lazy);
      return ListWrapper.map(binding.dependencies, getDependency);
    } catch (e) {
      this._clear(key);
      if (e instanceof ProviderError)
        e.addKey(key);
      throw e;
    }
  }
  _getInstance(key) {
    if (this._instances.length <= key.id)
      return null;
    return ListWrapper.get(this._instances, key.id);
  }
  _setInstance(key, obj) {
    ListWrapper.set(this._instances, key.id, obj);
  }
  _getBinding(key) {
    var binding = this._bindings.length <= key.id ? null : ListWrapper.get(this._bindings, key.id);
    if (isBlank(binding) && this._defaultBindings) {
      return bind(key.token).toClass(key.token);
    } else {
      return binding;
    }
  }
  _markAsConstructing(key) {
    this._setInstance(key, _constructing);
  }
  _clear(key) {
    this._setInstance(key, null);
  }
}
Object.defineProperty(Injector, "parameters", {get: function() {
    return [[List], []];
  }});
Object.defineProperty(Injector.prototype.createChild, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(Injector.prototype._getByKey, "parameters", {get: function() {
    return [[Key], [assert.type.boolean], [assert.type.boolean]];
  }});
Object.defineProperty(Injector.prototype._resolveDependencies, "parameters", {get: function() {
    return [[Key], [Binding], [assert.type.boolean]];
  }});
Object.defineProperty(Injector.prototype._getInstance, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(Injector.prototype._setInstance, "parameters", {get: function() {
    return [[Key], []];
  }});
Object.defineProperty(Injector.prototype._getBinding, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(Injector.prototype._markAsConstructing, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(Injector.prototype._clear, "parameters", {get: function() {
    return [[Key]];
  }});
class _SyncInjectorStrategy {
  constructor(injector) {
    this.injector = injector;
  }
  readFromCache(key) {
    if (key.token === Injector) {
      return this.injector;
    }
    var instance = this.injector._getInstance(key);
    if (instance === _constructing) {
      throw new CyclicDependencyError(key);
    } else if (isPresent(instance) && !_isWaiting(instance)) {
      return instance;
    } else {
      return null;
    }
  }
  instantiate(key) {
    var binding = this.injector._getBinding(key);
    if (isBlank(binding))
      return null;
    if (binding.providedAsPromise)
      throw new AsyncBindingError(key);
    this.injector._markAsConstructing(key);
    var deps = this.injector._resolveDependencies(key, binding, false);
    return this._createInstance(key, binding, deps);
  }
  _createInstance(key, binding, deps) {
    try {
      var instance = FunctionWrapper.apply(binding.factory, deps);
      this.injector._setInstance(key, instance);
      return instance;
    } catch (e) {
      this.injector._clear(key);
      throw new InstantiationError(e, key);
    }
  }
}
Object.defineProperty(_SyncInjectorStrategy, "parameters", {get: function() {
    return [[Injector]];
  }});
Object.defineProperty(_SyncInjectorStrategy.prototype.readFromCache, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(_SyncInjectorStrategy.prototype.instantiate, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(_SyncInjectorStrategy.prototype._createInstance, "parameters", {get: function() {
    return [[Key], [Binding], [List]];
  }});
class _AsyncInjectorStrategy {
  constructor(injector) {
    this.injector = injector;
  }
  readFromCache(key) {
    if (key.token === Injector) {
      return PromiseWrapper.resolve(this.injector);
    }
    var instance = this.injector._getInstance(key);
    if (instance === _constructing) {
      throw new CyclicDependencyError(key);
    } else if (_isWaiting(instance)) {
      return instance.promise;
    } else if (isPresent(instance)) {
      return PromiseWrapper.resolve(instance);
    } else {
      return null;
    }
  }
  instantiate(key) {
    var binding = this.injector._getBinding(key);
    if (isBlank(binding))
      return null;
    this.injector._markAsConstructing(key);
    var deps = this.injector._resolveDependencies(key, binding, true);
    var depsPromise = PromiseWrapper.all(deps);
    var promise = PromiseWrapper.then(depsPromise, null, (e) => this._errorHandler(key, e)).then((deps) => this._findOrCreate(key, binding, deps)).then((instance) => this._cacheInstance(key, instance));
    this.injector._setInstance(key, new _Waiting(promise));
    return promise;
  }
  _errorHandler(key, e) {
    if (e instanceof ProviderError)
      e.addKey(key);
    return PromiseWrapper.reject(e);
  }
  _findOrCreate(key, binding, deps) {
    try {
      var instance = this.injector._getInstance(key);
      if (!_isWaiting(instance))
        return instance;
      return FunctionWrapper.apply(binding.factory, deps);
    } catch (e) {
      this.injector._clear(key);
      throw new InstantiationError(e, key);
    }
  }
  _cacheInstance(key, instance) {
    this.injector._setInstance(key, instance);
    return instance;
  }
}
Object.defineProperty(_AsyncInjectorStrategy, "parameters", {get: function() {
    return [[Injector]];
  }});
Object.defineProperty(_AsyncInjectorStrategy.prototype.readFromCache, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(_AsyncInjectorStrategy.prototype.instantiate, "parameters", {get: function() {
    return [[Key]];
  }});
Object.defineProperty(_AsyncInjectorStrategy.prototype._errorHandler, "parameters", {get: function() {
    return [[Key], []];
  }});
Object.defineProperty(_AsyncInjectorStrategy.prototype._findOrCreate, "parameters", {get: function() {
    return [[Key], [Binding], [List]];
  }});
function _flattenBindings(bindings, res) {
  ListWrapper.forEach(bindings, function(b) {
    if (b instanceof Binding) {
      MapWrapper.set(res, b.key.id, b);
    } else if (b instanceof Type) {
      var s = bind(b).toClass(b);
      MapWrapper.set(res, s.key.id, s);
    } else if (b instanceof List) {
      _flattenBindings(b, res);
    } else if (b instanceof BindingBuilder) {
      throw new InvalidBindingError(b.token);
    } else {
      throw new InvalidBindingError(b);
    }
  });
  return res;
}
Object.defineProperty(_flattenBindings, "parameters", {get: function() {
    return [[List], [Map]];
  }});

//# sourceMappingURL=/Users/tbosch/projects/angular2/modules/angular2/src/di/injector.map

//# sourceMappingURL=./injector.map