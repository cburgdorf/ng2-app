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
  dynamicChangeDetection} from 'angular2/change_detection';
import {Compiler,
  CompilerCache} from 'angular2/src/core/compiler/compiler';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {NativeShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {Component} from 'angular2/src/core/annotations/annotations';
import {Template} from 'angular2/src/core/annotations/template';
import {TemplateLoader} from 'angular2/core';
import {TemplateResolver} from 'angular2/src/core/compiler/template_resolver';
import {Switch,
  SwitchWhen,
  SwitchDefault} from 'angular2/src/directives/switch';
export function main() {
  describe('switch', () => {
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
        directives: [Switch, SwitchWhen, SwitchDefault]
      });
      tplResolver.setTemplate(TestComponent, template);
      return compiler.compile(TestComponent);
    }
    describe('switch value changes', () => {
      it('should switch amongst when values', (done) => {
        var template = '<div>' + '<ul [switch]="switchValue">' + '<template [switch-when]="\'a\'"><li>when a</li></template>' + '<template [switch-when]="\'b\'"><li>when b</li></template>' + '</ul></div>';
        compileWithTemplate(template).then((pv) => {
          createView(pv);
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('');
          component.switchValue = 'a';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when a');
          component.switchValue = 'b';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when b');
          done();
        });
      });
      it('should switch amongst when values with fallback to default', (done) => {
        var template = '<div>' + '<ul [switch]="switchValue">' + '<li template="switch-when \'a\'">when a</li>' + '<li template="switch-default">when default</li>' + '</ul></div>';
        compileWithTemplate(template).then((pv) => {
          createView(pv);
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when default');
          component.switchValue = 'a';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when a');
          component.switchValue = 'b';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when default');
          done();
        });
      });
      it('should support multiple whens with the same value', (done) => {
        var template = '<div>' + '<ul [switch]="switchValue">' + '<template [switch-when]="\'a\'"><li>when a1;</li></template>' + '<template [switch-when]="\'b\'"><li>when b1;</li></template>' + '<template [switch-when]="\'a\'"><li>when a2;</li></template>' + '<template [switch-when]="\'b\'"><li>when b2;</li></template>' + '<template [switch-default]><li>when default1;</li></template>' + '<template [switch-default]><li>when default2;</li></template>' + '</ul></div>';
        compileWithTemplate(template).then((pv) => {
          createView(pv);
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when default1;when default2;');
          component.switchValue = 'a';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when a1;when a2;');
          component.switchValue = 'b';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when b1;when b2;');
          done();
        });
      });
    });
    describe('when values changes', () => {
      it('should switch amongst when values', (done) => {
        var template = '<div>' + '<ul [switch]="switchValue">' + '<template [switch-when]="when1"><li>when 1;</li></template>' + '<template [switch-when]="when2"><li>when 2;</li></template>' + '<template [switch-default]><li>when default;</li></template>' + '</ul></div>';
        compileWithTemplate(template).then((pv) => {
          createView(pv);
          component.when1 = 'a';
          component.when2 = 'b';
          component.switchValue = 'a';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when 1;');
          component.switchValue = 'b';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when 2;');
          component.switchValue = 'c';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when default;');
          component.when1 = 'c';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when 1;');
          component.when1 = 'd';
          cd.detectChanges();
          expect(DOM.getText(view.nodes[0])).toEqual('when default;');
          done();
        });
      });
    });
  });
}
class TestComponent {
  constructor() {
    this.switchValue = null;
    this.when1 = null;
    this.when2 = null;
  }
}
Object.defineProperty(TestComponent, "annotations", {get: function() {
    return [new Component({selector: 'test-cmp'})];
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

//# sourceMappingURL=/Users/cburgdorf/Documents/hacking/angular/modules/angular2/test/directives/switch_spec.map

//# sourceMappingURL=./switch_spec.map