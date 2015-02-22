import {List,
  MapWrapper,
  ListWrapper} from 'angular2/src/facade/collection';
export var window = frames.window;
export var DocumentFragment = window.DocumentFragment;
export var Node = window.Node;
export var NodeList = window.NodeList;
export var Text = window.Text;
export var Element = window.HTMLElement;
export var TemplateElement = window.HTMLTemplateElement;
export var StyleElement = window.HTMLStyleElement;
export var document = window.document;
export var location = window.location;
export var gc = window.gc ? () => window.gc() : () => null;
export class DOM {
  static query(selector) {
    return document.querySelector(selector);
  }
  static querySelector(el, selector) {
    return el.querySelector(selector);
  }
  static querySelectorAll(el, selector) {
    return el.querySelectorAll(selector);
  }
  static on(el, evt, listener) {
    el.addEventListener(evt, listener, false);
  }
  static dispatchEvent(el, evt) {
    el.dispatchEvent(evt);
  }
  static createMouseEvent(eventType) {
    var evt = new MouseEvent(eventType);
    evt.initEvent(eventType, true, true);
    return evt;
  }
  static createEvent(eventType) {
    return new Event(eventType, true);
  }
  static getInnerHTML(el) {
    return el.innerHTML;
  }
  static getOuterHTML(el) {
    return el.outerHTML;
  }
  static firstChild(el) {
    return el.firstChild;
  }
  static nextSibling(el) {
    return el.nextSibling;
  }
  static parentElement(el) {
    return el.parentElement;
  }
  static childNodes(el) {
    return el.childNodes;
  }
  static childNodesAsList(el) {
    var childNodes = el.childNodes;
    var res = ListWrapper.createFixedSize(childNodes.length);
    for (var i = 0; i < childNodes.length; i++) {
      res[i] = childNodes[i];
    }
    return res;
  }
  static clearNodes(el) {
    el.innerHTML = "";
  }
  static appendChild(el, node) {
    el.appendChild(node);
  }
  static removeChild(el, node) {
    el.removeChild(node);
  }
  static remove(el) {
    var parent = el.parentNode;
    parent.removeChild(el);
    return el;
  }
  static insertBefore(el, node) {
    el.parentNode.insertBefore(node, el);
  }
  static insertAllBefore(el, nodes) {
    ListWrapper.forEach(nodes, (n) => {
      el.parentNode.insertBefore(n, el);
    });
  }
  static insertAfter(el, node) {
    el.parentNode.insertBefore(node, el.nextSibling);
  }
  static setInnerHTML(el, value) {
    el.innerHTML = value;
  }
  static getText(el) {
    return el.textContent;
  }
  static setText(el, value) {
    el.textContent = value;
  }
  static createTemplate(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t;
  }
  static createElement(tagName, doc = document) {
    return doc.createElement(tagName);
  }
  static createScriptTag(attrName, attrValue, doc = document) {
    var el = doc.createElement("SCRIPT");
    el.setAttribute(attrName, attrValue);
    return el;
  }
  static createStyleElement(css, doc = document) {
    var style = doc.createElement('STYLE');
    style.innerText = css;
    return style;
  }
  static clone(node) {
    return node.cloneNode(true);
  }
  static hasProperty(element, name) {
    return name in element;
  }
  static getElementsByClassName(element, name) {
    return element.getElementsByClassName(name);
  }
  static getElementsByTagName(element, name) {
    return element.getElementsByTagName(name);
  }
  static classList(element) {
    return Array.prototype.slice.call(element.classList, 0);
  }
  static addClass(element, classname) {
    element.classList.add(classname);
  }
  static removeClass(element, classname) {
    element.classList.remove(classname);
  }
  static hasClass(element, classname) {
    return element.classList.contains(classname);
  }
  static setStyle(element, stylename, stylevalue) {
    element.style[stylename] = stylevalue;
  }
  static removeStyle(element, stylename) {
    element.style[stylename] = null;
  }
  static getStyle(element, stylename) {
    return element.style[stylename];
  }
  static tagName(element) {
    return element.tagName;
  }
  static attributeMap(element) {
    var res = MapWrapper.create();
    var elAttrs = element.attributes;
    for (var i = 0; i < elAttrs.length; i++) {
      var attrib = elAttrs[i];
      MapWrapper.set(res, attrib.name, attrib.value);
    }
    return res;
  }
  static getAttribute(element, attribute) {
    return element.getAttribute(attribute);
  }
  static setAttribute(element, name, value) {
    element.setAttribute(name, value);
  }
  static removeAttribute(element, attribute) {
    return element.removeAttribute(attribute);
  }
  static templateAwareRoot(el) {
    return el instanceof TemplateElement ? el.content : el;
  }
  static createHtmlDocument() {
    return document.implementation.createHTMLDocument();
  }
  static defaultDoc() {
    return document;
  }
  static elementMatches(n, selector) {
    return n instanceof Element && n.matches(selector);
  }
}
Object.defineProperty(DOM.querySelector, "parameters", {get: function() {
    return [[], [assert.type.string]];
  }});
Object.defineProperty(DOM.querySelectorAll, "parameters", {get: function() {
    return [[], [assert.type.string]];
  }});
Object.defineProperty(DOM.remove, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.getText, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.setText, "parameters", {get: function() {
    return [[], [assert.type.string]];
  }});
Object.defineProperty(DOM.createScriptTag, "parameters", {get: function() {
    return [[assert.type.string], [assert.type.string], []];
  }});
Object.defineProperty(DOM.createStyleElement, "parameters", {get: function() {
    return [[assert.type.string], []];
  }});
Object.defineProperty(DOM.clone, "parameters", {get: function() {
    return [[Node]];
  }});
Object.defineProperty(DOM.hasProperty, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.getElementsByClassName, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.getElementsByTagName, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.classList, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.addClass, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.removeClass, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.hasClass, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.setStyle, "parameters", {get: function() {
    return [[Element], [assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(DOM.removeStyle, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.getStyle, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.tagName, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.attributeMap, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.getAttribute, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.setAttribute, "parameters", {get: function() {
    return [[Element], [assert.type.string], [assert.type.string]];
  }});
Object.defineProperty(DOM.removeAttribute, "parameters", {get: function() {
    return [[Element], [assert.type.string]];
  }});
Object.defineProperty(DOM.templateAwareRoot, "parameters", {get: function() {
    return [[Element]];
  }});
Object.defineProperty(DOM.elementMatches, "parameters", {get: function() {
    return [[], [assert.type.string]];
  }});

//# sourceMappingURL=/Users/tbosch/projects/angular2/modules/angular2/src/facade/dom.map

//# sourceMappingURL=./dom.map