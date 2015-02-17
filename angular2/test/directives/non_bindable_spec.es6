import {assert} from "rtts_assert/rtts_assert";
import {describe,
  xit,
  it,
  expect,
  beforeEach,
  ddescribe,
  iit,
  el} from 'angular2/test_lib';
import {DOM} from 'angular2/src/facade/dom';
import {Map,
  MapWrapper} from 'angular2/src/facade/collection';
import {Type,
  isPresent} from 'angular2/src/facade/lang';
import {Injector} from 'angular2/di';
import {Lexer,
  Parser,
  ChangeDetector,
  dynamicChangeDetection} from 'angular2/change_detection';
import {Compiler,
  CompilerCache} from 'angular2/src/core/compiler/compiler';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {NativeShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {Decorator,
  Component} from 'angular2/src/core/annotations/annotations';
import {Template} from 'angular2/src/core/annotations/template';
import {TemplateLoader} from 'angular2/src/core/compiler/template_loader';
import {TemplateResolver} from 'angular2/src/core/compiler/template_resolver';
import {NgElement} from 'angular2/src/core/dom/element';
import {NonBindable} from 'angular2/src/directives/non_bindable';
export function main() {
  describe('non-bindable', () => {
    var view,
        cd,
        compiler,
        component,
        tplResolver;
    beforeEach(() => {
      tplResolver = new FakeTemplateResolver();
      compiler = new Compiler(dynamicChangeDetection, new TemplateLoader(null), new DirectiveMetadataReader(), new Parser(new Lexer()), new CompilerCache(), new NativeShadowDomStrategy(), tplResolver);
    });
    function createView(pv) {
      component = new TestComponent();
      view = pv.instantiate(null, null);
      view.hydrate(new Injector([]), null, component);
      cd = view.changeDetector;
    }
    function compileWithTemplate(html) {
      var template = new Template({
        inline: html,
        directives: [NonBindable, TestDecorator]
      });
      tplResolver.setTemplate(TestComponent, template);
      return compiler.compile(TestComponent);
    }
    it('should not interpolate children', (done) => {
      var template = '<div>{{text}}<span non-bindable>{{text}}</span></div>';
      compileWithTemplate(template).then((pv) => {
        createView(pv);
        cd.detectChanges();
        expect(DOM.getText(view.nodes[0])).toEqual('foo{{text}}');
        done();
      });
    });
    it('should ignore directives on child nodes', (done) => {
      var template = '<div non-bindable><span id=child test-dec>{{text}}</span></div>';
      compileWithTemplate(template).then((pv) => {
        createView(pv);
        cd.detectChanges();
        var span = DOM.querySelector(view.nodes[0], '#child');
        expect(DOM.hasClass(span, 'compiled')).toBeFalsy();
        done();
      });
    });
    it('should trigger directives on the same node', (done) => {
      var template = '<div><span id=child non-bindable test-dec>{{text}}</span></div>';
      compileWithTemplate(template).then((pv) => {
        createView(pv);
        cd.detectChanges();
        var span = DOM.querySelector(view.nodes[0], '#child');
        expect(DOM.hasClass(span, 'compiled')).toBeTruthy();
        done();
      });
    });
  });
}
class TestComponent {
  constructor() {
    this.text = 'foo';
  }
}
Object.defineProperty(TestComponent, "annotations", {get: function() {
    return [new Component({selector: 'test-cmp'})];
  }});
class TestDecorator {
  constructor(el) {
    assert.argumentTypes(el, NgElement);
    DOM.addClass(el.domElement, 'compiled');
  }
}
Object.defineProperty(TestDecorator, "annotations", {get: function() {
    return [new Decorator({selector: '[test-dec]'})];
  }});
Object.defineProperty(TestDecorator, "parameters", {get: function() {
    return [[NgElement]];
  }});
class FakeTemplateResolver extends TemplateResolver {
  constructor() {
    super();
    this._cmpTemplates = MapWrapper.create();
  }
  setTemplate(component, template) {
    assert.argumentTypes(component, Type, template, Template);
    MapWrapper.set(this._cmpTemplates, component, template);
  }
  resolve(component) {
    assert.argumentTypes(component, Type);
    var override = MapWrapper.get(this._cmpTemplates, component);
    if (isPresent(override)) {
      return assert.returnType((override), Template);
    }
    return assert.returnType((super.resolve(component)), Template);
  }
}
Object.defineProperty(FakeTemplateResolver.prototype.setTemplate, "parameters", {get: function() {
    return [[Type], [Template]];
  }});
Object.defineProperty(FakeTemplateResolver.prototype.resolve, "parameters", {get: function() {
    return [[Type]];
  }});

//# sourceMappingURL=/Users/cburgdorf/Documents/hacking/angular/modules/angular2/test/directives/non_bindable_spec.map

//# sourceMappingURL=./non_bindable_spec.map