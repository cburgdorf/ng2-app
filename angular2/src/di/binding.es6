import {FIELD,
  Type,
  isBlank,
  isPresent} from 'angular2/src/facade/lang';
import {List,
  MapWrapper,
  ListWrapper} from 'angular2/src/facade/collection';
import {reflector} from 'angular2/src/reflection/reflection';
import {Key} from './key';
import {Inject,
  InjectLazy,
  InjectPromise,
  DependencyAnnotation} from './annotations';
import {NoAnnotationError} from './exceptions';
export class Dependency {
  constructor(key, asPromise, lazy, properties) {
    this.key = key;
    this.asPromise = asPromise;
    this.lazy = lazy;
    this.properties = properties;
  }
}
Object.defineProperty(Dependency, "parameters", {get: function() {
    return [[Key], [assert.type.boolean], [assert.type.boolean], [List]];
  }});
export class Binding {
  constructor(key, factory, dependencies, providedAsPromise) {
    this.key = key;
    this.factory = factory;
    this.dependencies = dependencies;
    this.providedAsPromise = providedAsPromise;
  }
}
Object.defineProperty(Binding, "parameters", {get: function() {
    return [[Key], [Function], [List], [assert.type.boolean]];
  }});
export function bind(token) {
  return new BindingBuilder(token);
}
export class BindingBuilder {
  constructor(token) {
    this.token = token;
  }
  toClass(type) {
    return new Binding(Key.get(this.token), reflector.factory(type), _dependenciesFor(type), false);
  }
  toValue(value) {
    return new Binding(Key.get(this.token), () => value, [], false);
  }
  toFactory(factoryFunction, dependencies = null) {
    return new Binding(Key.get(this.token), factoryFunction, this._constructDependencies(factoryFunction, dependencies), false);
  }
  toAsyncFactory(factoryFunction, dependencies = null) {
    return new Binding(Key.get(this.token), factoryFunction, this._constructDependencies(factoryFunction, dependencies), true);
  }
  _constructDependencies(factoryFunction, dependencies) {
    return isBlank(dependencies) ? _dependenciesFor(factoryFunction) : ListWrapper.map(dependencies, (t) => new Dependency(Key.get(t), false, false, []));
  }
}
Object.defineProperty(BindingBuilder.prototype.toClass, "parameters", {get: function() {
    return [[Type]];
  }});
Object.defineProperty(BindingBuilder.prototype.toFactory, "parameters", {get: function() {
    return [[Function], [List]];
  }});
Object.defineProperty(BindingBuilder.prototype.toAsyncFactory, "parameters", {get: function() {
    return [[Function], [List]];
  }});
Object.defineProperty(BindingBuilder.prototype._constructDependencies, "parameters", {get: function() {
    return [[Function], [List]];
  }});
function _dependenciesFor(typeOrFunc) {
  var params = reflector.parameters(typeOrFunc);
  if (isBlank(params))
    return [];
  if (ListWrapper.any(params, (p) => isBlank(p)))
    throw new NoAnnotationError(typeOrFunc);
  return ListWrapper.map(params, (p) => _extractToken(typeOrFunc, p));
}
function _extractToken(typeOrFunc, annotations) {
  var type;
  var depProps = [];
  for (var i = 0; i < annotations.length; ++i) {
    var paramAnnotation = annotations[i];
    if (paramAnnotation instanceof Type) {
      type = paramAnnotation;
    } else if (paramAnnotation instanceof Inject) {
      return _createDependency(paramAnnotation.token, false, false, []);
    } else if (paramAnnotation instanceof InjectPromise) {
      return _createDependency(paramAnnotation.token, true, false, []);
    } else if (paramAnnotation instanceof InjectLazy) {
      return _createDependency(paramAnnotation.token, false, true, []);
    } else if (paramAnnotation instanceof DependencyAnnotation) {
      ListWrapper.push(depProps, paramAnnotation);
    }
  }
  if (isPresent(type)) {
    return _createDependency(type, false, false, depProps);
  } else {
    throw new NoAnnotationError(typeOrFunc);
  }
}
function _createDependency(token, asPromise, lazy, depProps) {
  return new Dependency(Key.get(token), asPromise, lazy, depProps);
}

//# sourceMappingURL=/Users/tbosch/projects/angular2/modules/angular2/src/di/binding.map

//# sourceMappingURL=./binding.map