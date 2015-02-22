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
export class ShadowDomStrategy {
  attachTemplate(el, view) {}
  constructLightDom(lightDomView, shadowDomView, el) {}
  polyfillDirectives() {
    return null;
  }
  shim() {
    return false;
  }
  extractStyles() {
    return false;
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
    DOM.clearNodes(el);
    moveViewNodesIntoParent(el, view);
  }
  constructLightDom(lightDomView, shadowDomView, el) {
    return new LightDom(lightDomView, shadowDomView, el);
  }
  polyfillDirectives() {
    return [Content];
  }
  shim() {
    return true;
  }
  extractStyles() {
    return true;
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
    moveViewNodesIntoParent(el.createShadowRoot(), view);
  }
  constructLightDom(lightDomView, shadowDomView, el) {
    return null;
  }
  polyfillDirectives() {
    return [];
  }
  shim() {
    return false;
  }
  extractStyles() {
    return false;
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

//# sourceMappingURL=/Users/tbosch/projects/angular2/modules/angular2/src/core/compiler/shadow_dom_strategy.map

//# sourceMappingURL=./shadow_dom_strategy.map