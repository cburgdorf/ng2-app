import {DOM,
  Element,
  Node,
  Text,
  DocumentFragment,
  TemplateElement} from 'angular2/src/facade/dom';
import {ListWrapper,
  MapWrapper,
  StringMapWrapper,
  List} from 'angular2/src/facade/collection';
import {AST,
  ContextWithVariableBindings,
  ChangeDispatcher,
  ProtoChangeDetector,
  ChangeDetector,
  ChangeRecord} from 'angular2/change_detection';
import {ProtoElementInjector,
  ElementInjector,
  PreBuiltObjects} from './element_injector';
import {BindingPropagationConfig} from './binding_propagation_config';
import {ElementBinder} from './element_binder';
import {DirectiveMetadata} from './directive_metadata';
import {SetterFn} from 'angular2/src/reflection/types';
import {FIELD,
  IMPLEMENTS,
  int,
  isPresent,
  isBlank,
  BaseException} from 'angular2/src/facade/lang';
import {Injector} from 'angular2/di';
import {NgElement} from 'angular2/src/core/dom/element';
import {ViewContainer} from './view_container';
import {LightDom,
  DestinationLightDom} from './shadow_dom_emulation/light_dom';
import {ShadowDomStrategy} from './shadow_dom_strategy';
import {ViewPool} from './view_pool';
import {EventManager} from 'angular2/src/core/events/event_manager';
const NG_BINDING_CLASS = 'ng-binding';
const NG_BINDING_CLASS_SELECTOR = '.ng-binding';
var NO_FORMATTERS = MapWrapper.create();
var VIEW_POOL_CAPACITY = 10000;
var VIEW_POOL_PREFILL = 0;
export class View {
  constructor(proto, nodes, protoChangeDetector, protoContextLocals) {
    this.proto = proto;
    this.nodes = nodes;
    this.changeDetector = protoChangeDetector.instantiate(this, NO_FORMATTERS);
    this.elementInjectors = null;
    this.rootElementInjectors = null;
    this.textNodes = null;
    this.bindElements = null;
    this.componentChildViews = null;
    this.viewContainers = null;
    this.preBuiltObjects = null;
    this.context = null;
    this.contextWithLocals = (MapWrapper.size(protoContextLocals) > 0) ? new ContextWithVariableBindings(null, MapWrapper.clone(protoContextLocals)) : null;
  }
  init(elementInjectors, rootElementInjectors, textNodes, bindElements, viewContainers, preBuiltObjects, componentChildViews) {
    this.elementInjectors = elementInjectors;
    this.rootElementInjectors = rootElementInjectors;
    this.textNodes = textNodes;
    this.bindElements = bindElements;
    this.viewContainers = viewContainers;
    this.preBuiltObjects = preBuiltObjects;
    this.componentChildViews = componentChildViews;
  }
  setLocal(contextName, value) {
    if (!this.hydrated())
      throw new BaseException('Cannot set locals on dehydrated view.');
    if (!MapWrapper.contains(this.proto.variableBindings, contextName)) {
      return ;
    }
    var templateName = MapWrapper.get(this.proto.variableBindings, contextName);
    this.context.set(templateName, value);
  }
  hydrated() {
    return isPresent(this.context);
  }
  _hydrateContext(newContext) {
    if (isPresent(this.contextWithLocals)) {
      this.contextWithLocals.parent = newContext;
      this.context = this.contextWithLocals;
    } else {
      this.context = newContext;
    }
    this.changeDetector.setContext(this.context);
  }
  _dehydrateContext() {
    if (isPresent(this.contextWithLocals)) {
      this.contextWithLocals.clearValues();
    }
    this.context = null;
  }
  hydrate(appInjector, hostElementInjector, context) {
    if (this.hydrated())
      throw new BaseException('The view is already hydrated.');
    this._hydrateContext(context);
    for (var i = 0; i < this.viewContainers.length; i++) {
      this.viewContainers[i].hydrate(appInjector, hostElementInjector);
    }
    var binders = this.proto.elementBinders;
    var componentChildViewIndex = 0;
    for (var i = 0; i < binders.length; ++i) {
      var componentDirective = binders[i].componentDirective;
      var shadowDomAppInjector = null;
      if (isPresent(componentDirective)) {
        var services = componentDirective.annotation.componentServices;
        if (isPresent(services))
          shadowDomAppInjector = appInjector.createChild(services);
        else {
          shadowDomAppInjector = appInjector;
        }
      } else {
        shadowDomAppInjector = null;
      }
      var elementInjector = this.elementInjectors[i];
      if (isPresent(elementInjector)) {
        elementInjector.instantiateDirectives(appInjector, shadowDomAppInjector, this.preBuiltObjects[i]);
        var exportImplicitName = elementInjector.getExportImplicitName();
        if (elementInjector.isExportingComponent()) {
          this.context.set(exportImplicitName, elementInjector.getComponent());
        } else if (elementInjector.isExportingElement()) {
          this.context.set(exportImplicitName, elementInjector.getNgElement().domElement);
        }
      }
      if (isPresent(componentDirective)) {
        this.componentChildViews[componentChildViewIndex++].hydrate(shadowDomAppInjector, elementInjector, elementInjector.getComponent());
      }
    }
    for (var i = 0; i < binders.length; ++i) {
      var componentDirective = binders[i].componentDirective;
      if (isPresent(componentDirective)) {
        var lightDom = this.preBuiltObjects[i].lightDom;
        if (isPresent(lightDom)) {
          lightDom.redistribute();
        }
      }
    }
  }
  dehydrate() {
    for (var i = 0; i < this.componentChildViews.length; i++) {
      this.componentChildViews[i].dehydrate();
    }
    for (var i = 0; i < this.elementInjectors.length; i++) {
      if (isPresent(this.elementInjectors[i])) {
        this.elementInjectors[i].clearDirectives();
      }
    }
    if (isPresent(this.viewContainers)) {
      for (var i = 0; i < this.viewContainers.length; i++) {
        this.viewContainers[i].dehydrate();
      }
    }
    this._dehydrateContext();
  }
  onRecordChange(directiveMemento, records) {
    this._invokeMementos(records);
    if (directiveMemento instanceof DirectiveMemento) {
      this._notifyDirectiveAboutChanges(directiveMemento, records);
    }
  }
  _invokeMementos(records) {
    for (var i = 0; i < records.length; ++i) {
      this._invokeMementoFor(records[i]);
    }
  }
  _notifyDirectiveAboutChanges(directiveMemento, records) {
    var dir = directiveMemento.directive(this.elementInjectors);
    var binding = directiveMemento.directiveBinding(this.elementInjectors);
    if (binding.callOnChange) {
      dir.onChange(this._collectChanges(records));
    }
  }
  _invokeMementoFor(record) {
    var memento = record.bindingMemento;
    if (memento instanceof DirectiveBindingMemento) {
      var directiveMemento = memento;
      directiveMemento.invoke(record, this.elementInjectors);
    } else if (memento instanceof ElementBindingMemento) {
      var elementMemento = memento;
      elementMemento.invoke(record, this.bindElements);
    } else {
      var textNodeIndex = memento;
      DOM.setText(this.textNodes[textNodeIndex], record.currentValue);
    }
  }
  _collectChanges(records) {
    var changes = StringMapWrapper.create();
    for (var i = 0; i < records.length; ++i) {
      var record = records[i];
      var propertyUpdate = new PropertyUpdate(record.currentValue, record.previousValue);
      StringMapWrapper.set(changes, record.bindingMemento._setterName, propertyUpdate);
    }
    return changes;
  }
}
Object.defineProperty(View, "annotations", {get: function() {
    return [new IMPLEMENTS(ChangeDispatcher)];
  }});
Object.defineProperty(View, "parameters", {get: function() {
    return [[ProtoView], [assert.genericType(List, Node)], [ProtoChangeDetector], [Map]];
  }});
Object.defineProperty(View.prototype.init, "parameters", {get: function() {
    return [[List], [List], [List], [List], [List], [List], [List]];
  }});
Object.defineProperty(View.prototype.setLocal, "parameters", {get: function() {
    return [[assert.type.string], []];
  }});
Object.defineProperty(View.prototype.hydrate, "parameters", {get: function() {
    return [[Injector], [ElementInjector], [Object]];
  }});
Object.defineProperty(View.prototype.onRecordChange, "parameters", {get: function() {
    return [[], [List]];
  }});
Object.defineProperty(View.prototype._invokeMementos, "parameters", {get: function() {
    return [[List]];
  }});
Object.defineProperty(View.prototype._notifyDirectiveAboutChanges, "parameters", {get: function() {
    return [[], [List]];
  }});
Object.defineProperty(View.prototype._invokeMementoFor, "parameters", {get: function() {
    return [[ChangeRecord]];
  }});
Object.defineProperty(View.prototype._collectChanges, "parameters", {get: function() {
    return [[List]];
  }});
export class ProtoView {
  constructor(template, protoChangeDetector, shadowDomStrategy) {
    this.element = template;
    this.elementBinders = [];
    this.variableBindings = MapWrapper.create();
    this.protoContextLocals = MapWrapper.create();
    this.protoChangeDetector = protoChangeDetector;
    this.textNodesWithBindingCount = 0;
    this.elementsWithBindingCount = 0;
    this.instantiateInPlace = false;
    this.rootBindingOffset = (isPresent(this.element) && DOM.hasClass(this.element, NG_BINDING_CLASS)) ? 1 : 0;
    this.isTemplateElement = this.element instanceof TemplateElement;
    this.shadowDomStrategy = shadowDomStrategy;
    this._viewPool = new ViewPool(VIEW_POOL_CAPACITY);
  }
  instantiate(hostElementInjector, eventManager) {
    if (this._viewPool.length() == 0)
      this._preFillPool(hostElementInjector, eventManager);
    var view = this._viewPool.pop();
    return isPresent(view) ? view : this._instantiate(hostElementInjector, eventManager);
  }
  _preFillPool(hostElementInjector, eventManager) {
    for (var i = 0; i < VIEW_POOL_PREFILL; i++) {
      this._viewPool.push(this._instantiate(hostElementInjector, eventManager));
    }
  }
  _instantiate(hostElementInjector, eventManager) {
    var rootElementClone = this.instantiateInPlace ? this.element : DOM.clone(this.element);
    var elementsWithBindingsDynamic;
    if (this.isTemplateElement) {
      elementsWithBindingsDynamic = DOM.querySelectorAll(rootElementClone.content, NG_BINDING_CLASS_SELECTOR);
    } else {
      elementsWithBindingsDynamic = DOM.getElementsByClassName(rootElementClone, NG_BINDING_CLASS);
    }
    var elementsWithBindings = ListWrapper.createFixedSize(elementsWithBindingsDynamic.length);
    for (var i = 0; i < elementsWithBindingsDynamic.length; ++i) {
      elementsWithBindings[i] = elementsWithBindingsDynamic[i];
    }
    var viewNodes;
    if (this.isTemplateElement) {
      var childNode = DOM.firstChild(rootElementClone.content);
      viewNodes = [];
      while (childNode != null) {
        ListWrapper.push(viewNodes, childNode);
        childNode = DOM.nextSibling(childNode);
      }
    } else {
      viewNodes = [rootElementClone];
    }
    var view = new View(this, viewNodes, this.protoChangeDetector, this.protoContextLocals);
    var binders = this.elementBinders;
    var elementInjectors = ListWrapper.createFixedSize(binders.length);
    var rootElementInjectors = [];
    var textNodes = [];
    var elementsWithPropertyBindings = [];
    var preBuiltObjects = ListWrapper.createFixedSize(binders.length);
    var viewContainers = [];
    var componentChildViews = [];
    for (var i = 0; i < binders.length; i++) {
      var binder = binders[i];
      var element;
      if (i === 0 && this.rootBindingOffset === 1) {
        element = rootElementClone;
      } else {
        element = elementsWithBindings[i - this.rootBindingOffset];
      }
      var elementInjector = null;
      var protoElementInjector = binder.protoElementInjector;
      if (isPresent(protoElementInjector)) {
        if (isPresent(protoElementInjector.parent)) {
          var parentElementInjector = elementInjectors[protoElementInjector.parent.index];
          elementInjector = protoElementInjector.instantiate(parentElementInjector, null, binder.events);
        } else {
          elementInjector = protoElementInjector.instantiate(null, hostElementInjector, binder.events);
          ListWrapper.push(rootElementInjectors, elementInjector);
        }
      }
      elementInjectors[i] = elementInjector;
      if (binder.hasElementPropertyBindings) {
        ListWrapper.push(elementsWithPropertyBindings, element);
      }
      var textNodeIndices = binder.textNodeIndices;
      if (isPresent(textNodeIndices)) {
        var childNode = DOM.firstChild(DOM.templateAwareRoot(element));
        for (var j = 0,
            k = 0; j < textNodeIndices.length; j++) {
          for (var index = textNodeIndices[j]; k < index; k++) {
            childNode = DOM.nextSibling(childNode);
          }
          ListWrapper.push(textNodes, childNode);
        }
      }
      var lightDom = null;
      var bindingPropagationConfig = null;
      if (isPresent(binder.componentDirective)) {
        var strategy = this.shadowDomStrategy;
        var childView = binder.nestedProtoView.instantiate(elementInjector, eventManager);
        view.changeDetector.addChild(childView.changeDetector);
        lightDom = strategy.constructLightDom(view, childView, element);
        strategy.attachTemplate(element, childView);
        bindingPropagationConfig = new BindingPropagationConfig(view.changeDetector);
        ListWrapper.push(componentChildViews, childView);
      }
      var viewContainer = null;
      if (isPresent(binder.viewportDirective)) {
        var destLightDom = this._directParentElementLightDom(protoElementInjector, preBuiltObjects);
        viewContainer = new ViewContainer(view, element, binder.nestedProtoView, elementInjector, eventManager, destLightDom);
        ListWrapper.push(viewContainers, viewContainer);
      }
      if (isPresent(elementInjector)) {
        preBuiltObjects[i] = new PreBuiltObjects(view, new NgElement(element), viewContainer, lightDom, bindingPropagationConfig);
      }
      if (isPresent(binder.events)) {
        MapWrapper.forEach(binder.events, (expr, eventName) => {
          if (isBlank(elementInjector) || !elementInjector.hasEventEmitter(eventName)) {
            var handler = ProtoView.buildInnerCallback(expr, view);
            eventManager.addEventListener(element, eventName, handler);
          }
        });
      }
    }
    view.init(elementInjectors, rootElementInjectors, textNodes, elementsWithPropertyBindings, viewContainers, preBuiltObjects, componentChildViews);
    return view;
  }
  returnToPool(view) {
    this._viewPool.push(view);
  }
  static buildInnerCallback(expr, view) {
    var locals = MapWrapper.create();
    return (event) => {
      if (view.hydrated()) {
        MapWrapper.set(locals, '$event', event);
        var context = new ContextWithVariableBindings(view.context, locals);
        expr.eval(context);
      }
    };
  }
  _directParentElementLightDom(protoElementInjector, preBuiltObjects) {
    var p = protoElementInjector.directParent();
    return isPresent(p) ? preBuiltObjects[p.index].lightDom : null;
  }
  bindVariable(contextName, templateName) {
    MapWrapper.set(this.variableBindings, contextName, templateName);
    MapWrapper.set(this.protoContextLocals, templateName, null);
  }
  bindElement(protoElementInjector, componentDirective = null, viewportDirective = null) {
    var elBinder = new ElementBinder(protoElementInjector, componentDirective, viewportDirective);
    ListWrapper.push(this.elementBinders, elBinder);
    return elBinder;
  }
  bindTextNode(indexInParent, expression) {
    var elBinder = this.elementBinders[this.elementBinders.length - 1];
    if (isBlank(elBinder.textNodeIndices)) {
      elBinder.textNodeIndices = ListWrapper.create();
    }
    ListWrapper.push(elBinder.textNodeIndices, indexInParent);
    var memento = this.textNodesWithBindingCount++;
    this.protoChangeDetector.addAst(expression, memento);
  }
  bindElementProperty(expression, setterName, setter) {
    var elBinder = this.elementBinders[this.elementBinders.length - 1];
    if (!elBinder.hasElementPropertyBindings) {
      elBinder.hasElementPropertyBindings = true;
      this.elementsWithBindingCount++;
    }
    var memento = new ElementBindingMemento(this.elementsWithBindingCount - 1, setterName, setter);
    this.protoChangeDetector.addAst(expression, memento);
  }
  bindEvent(eventName, expression) {
    var elBinder = this.elementBinders[this.elementBinders.length - 1];
    if (isBlank(elBinder.events)) {
      elBinder.events = MapWrapper.create();
    }
    MapWrapper.set(elBinder.events, eventName, expression);
  }
  bindDirectiveProperty(directiveIndex, expression, setterName, setter, isContentWatch) {
    var bindingMemento = new DirectiveBindingMemento(this.elementBinders.length - 1, directiveIndex, setterName, setter);
    var directiveMemento = DirectiveMemento.get(bindingMemento);
    this.protoChangeDetector.addAst(expression, bindingMemento, directiveMemento, isContentWatch);
  }
  static createRootProtoView(protoView, insertionElement, rootComponentAnnotatedType, protoChangeDetector, shadowDomStrategy) {
    DOM.addClass(insertionElement, NG_BINDING_CLASS);
    var rootProtoView = new ProtoView(insertionElement, protoChangeDetector, shadowDomStrategy);
    rootProtoView.instantiateInPlace = true;
    var binder = rootProtoView.bindElement(new ProtoElementInjector(null, 0, [rootComponentAnnotatedType.type], true));
    binder.componentDirective = rootComponentAnnotatedType;
    binder.nestedProtoView = protoView;
    return rootProtoView;
  }
}
Object.defineProperty(ProtoView, "parameters", {get: function() {
    return [[Element], [ProtoChangeDetector], [ShadowDomStrategy]];
  }});
Object.defineProperty(ProtoView.prototype.instantiate, "parameters", {get: function() {
    return [[ElementInjector], [EventManager]];
  }});
Object.defineProperty(ProtoView.prototype._preFillPool, "parameters", {get: function() {
    return [[ElementInjector], [EventManager]];
  }});
Object.defineProperty(ProtoView.prototype._instantiate, "parameters", {get: function() {
    return [[ElementInjector], [EventManager]];
  }});
Object.defineProperty(ProtoView.prototype.returnToPool, "parameters", {get: function() {
    return [[View]];
  }});
Object.defineProperty(ProtoView.buildInnerCallback, "parameters", {get: function() {
    return [[AST], [View]];
  }});
Object.defineProperty(ProtoView.prototype._directParentElementLightDom, "parameters", {get: function() {
    return [[ProtoElementInjector], [List]];
  }});
Object.defineProperty(ProtoView.prototype.bindVariable, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(ProtoView.prototype.bindElement, "parameters", {get: function() {
    return [[ProtoElementInjector], [DirectiveMetadata], [DirectiveMetadata]];
  }});
Object.defineProperty(ProtoView.prototype.bindTextNode, "parameters", {get: function() {
    return [[int], [AST]];
  }});
Object.defineProperty(ProtoView.prototype.bindElementProperty, "parameters", {get: function() {
    return [[AST], [assert.type.string], [SetterFn]];
  }});
Object.defineProperty(ProtoView.prototype.bindEvent, "parameters", {get: function() {
    return [[assert.type.string], [AST]];
  }});
Object.defineProperty(ProtoView.prototype.bindDirectiveProperty, "parameters", {get: function() {
    return [[assert.type.number], [AST], [assert.type.string], [SetterFn], [assert.type.boolean]];
  }});
Object.defineProperty(ProtoView.createRootProtoView, "parameters", {get: function() {
    return [[ProtoView], [], [DirectiveMetadata], [ProtoChangeDetector], [ShadowDomStrategy]];
  }});
export class ElementBindingMemento {
  constructor(elementIndex, setterName, setter) {
    this._elementIndex = elementIndex;
    this._setterName = setterName;
    this._setter = setter;
  }
  invoke(record, bindElements) {
    var element = bindElements[this._elementIndex];
    this._setter(element, record.currentValue);
  }
}
Object.defineProperty(ElementBindingMemento, "parameters", {get: function() {
    return [[int], [assert.type.string], [SetterFn]];
  }});
Object.defineProperty(ElementBindingMemento.prototype.invoke, "parameters", {get: function() {
    return [[ChangeRecord], [assert.genericType(List, Element)]];
  }});
export class DirectiveBindingMemento {
  constructor(elementInjectorIndex, directiveIndex, setterName, setter) {
    this._elementInjectorIndex = elementInjectorIndex;
    this._directiveIndex = directiveIndex;
    this._setterName = setterName;
    this._setter = setter;
  }
  invoke(record, elementInjectors) {
    var elementInjector = elementInjectors[this._elementInjectorIndex];
    var directive = elementInjector.getDirectiveAtIndex(this._directiveIndex);
    this._setter(directive, record.currentValue);
  }
}
Object.defineProperty(DirectiveBindingMemento, "parameters", {get: function() {
    return [[assert.type.number], [assert.type.number], [assert.type.string], [SetterFn]];
  }});
Object.defineProperty(DirectiveBindingMemento.prototype.invoke, "parameters", {get: function() {
    return [[ChangeRecord], [assert.genericType(List, ElementInjector)]];
  }});
var _directiveMementos = MapWrapper.create();
class DirectiveMemento {
  constructor(elementInjectorIndex, directiveIndex) {
    this._elementInjectorIndex = elementInjectorIndex;
    this._directiveIndex = directiveIndex;
  }
  static get(memento) {
    var elementInjectorIndex = memento._elementInjectorIndex;
    var directiveIndex = memento._directiveIndex;
    var id = elementInjectorIndex * 100 + directiveIndex;
    if (!MapWrapper.contains(_directiveMementos, id)) {
      MapWrapper.set(_directiveMementos, id, new DirectiveMemento(elementInjectorIndex, directiveIndex));
    }
    return MapWrapper.get(_directiveMementos, id);
  }
  directive(elementInjectors) {
    var elementInjector = elementInjectors[this._elementInjectorIndex];
    return elementInjector.getDirectiveAtIndex(this._directiveIndex);
  }
  directiveBinding(elementInjectors) {
    var elementInjector = elementInjectors[this._elementInjectorIndex];
    return elementInjector.getDirectiveBindingAtIndex(this._directiveIndex);
  }
}
Object.defineProperty(DirectiveMemento, "parameters", {get: function() {
    return [[assert.type.number], [assert.type.number]];
  }});
Object.defineProperty(DirectiveMemento.get, "parameters", {get: function() {
    return [[DirectiveBindingMemento]];
  }});
Object.defineProperty(DirectiveMemento.prototype.directive, "parameters", {get: function() {
    return [[assert.genericType(List, ElementInjector)]];
  }});
Object.defineProperty(DirectiveMemento.prototype.directiveBinding, "parameters", {get: function() {
    return [[assert.genericType(List, ElementInjector)]];
  }});
class PropertyUpdate {
  constructor(currentValue, previousValue) {
    this.currentValue = currentValue;
    this.previousValue = previousValue;
  }
}

//# sourceMappingURL=/Users/tbosch/projects/angular2/modules/angular2/src/core/compiler/view.map

//# sourceMappingURL=./view.map