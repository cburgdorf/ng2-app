import {assert} from "rtts_assert/rtts_assert";
import {Type,
  isBlank,
  isPresent} from 'angular2/src/facade/lang';
import {DOM,
  Element} from 'angular2/src/facade/dom';
import {List,
  ListWrapper} from 'angular2/src/facade/collection';
import {View} from './view';
import {Content} from './shadow_dom_emulation/content_tag';
import {LightDom} from './shadow_dom_emulation/light_dom';
import {DirectiveMetadata} from './directive_metadata';
export class ShadowDomStrategy {
  attachTemplate(el, view) {
    assert.argumentTypes(el, Element, view, View);
  }
  constructLightDom(lightDomView, shadowDomView, el) {
    assert.argumentTypes(lightDomView, View, shadowDomView, View, el, Element);
  }
  polyfillDirectives() {
    return assert.returnType((null), assert.genericType(List, Type));
  }
  shim() {
    return assert.returnType((false), assert.type.boolean);
  }
  extractStyles() {
    return assert.returnType((false), assert.type.boolean);
  }
}
Object.defineProperty(ShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[Element], [View]];
  }});
Object.defineProperty(ShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
    return [[View], [View], [Element]];
  }});
export class EmulatedShadowDomStrategy extends ShadowDomStrategy {
  constructor() {
    super();
  }
  attachTemplate(el, view) {
    assert.argumentTypes(el, Element, view, View);
    DOM.clearNodes(el);
    moveViewNodesIntoParent(el, view);
  }
  constructLightDom(lightDomView, shadowDomView, el) {
    assert.argumentTypes(lightDomView, View, shadowDomView, View, el, Element);
    return new LightDom(lightDomView, shadowDomView, el);
  }
  polyfillDirectives() {
    return assert.returnType(([Content]), assert.genericType(List, Type));
  }
  shim() {
    return assert.returnType((true), assert.type.boolean);
  }
  extractStyles() {
    return assert.returnType((true), assert.type.boolean);
  }
}
Object.defineProperty(EmulatedShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[Element], [View]];
  }});
Object.defineProperty(EmulatedShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
    return [[View], [View], [Element]];
  }});
export class NativeShadowDomStrategy extends ShadowDomStrategy {
  constructor() {
    super();
  }
  attachTemplate(el, view) {
    assert.argumentTypes(el, Element, view, View);
    moveViewNodesIntoParent(el.createShadowRoot(), view);
  }
  constructLightDom(lightDomView, shadowDomView, el) {
    assert.argumentTypes(lightDomView, View, shadowDomView, View, el, Element);
    return null;
  }
  polyfillDirectives() {
    return assert.returnType(([]), assert.genericType(List, Type));
  }
  shim() {
    return assert.returnType((false), assert.type.boolean);
  }
  extractStyles() {
    return assert.returnType((false), assert.type.boolean);
  }
}
Object.defineProperty(NativeShadowDomStrategy.prototype.attachTemplate, "parameters", {get: function() {
    return [[Element], [View]];
  }});
Object.defineProperty(NativeShadowDomStrategy.prototype.constructLightDom, "parameters", {get: function() {
    return [[View], [View], [Element]];
  }});
function moveViewNodesIntoParent(parent, view) {
  for (var i = 0; i < view.nodes.length; ++i) {
    DOM.appendChild(parent, view.nodes[i]);
  }
}

//# sourceMappingURL=/Users/cburgdorf/Documents/hacking/angular/modules/angular2/src/core/compiler/shadow_dom_strategy.map

//# sourceMappingURL=./shadow_dom_strategy.map