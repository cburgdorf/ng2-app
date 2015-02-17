import {assert} from "rtts_assert/rtts_assert";
import {CompileElement} from './compile_element';
import {CompileControl} from './compile_control';
import {DirectiveMetadata} from '../directive_metadata';
export class CompileStep {
  process(parent, current, control) {
    assert.argumentTypes(parent, CompileElement, current, CompileElement, control, CompileControl);
  }
}
Object.defineProperty(CompileStep.prototype.process, "parameters", {get: function() {
    return [[CompileElement], [CompileElement], [CompileControl]];
  }});

//# sourceMappingURL=/Users/cburgdorf/Documents/hacking/angular/modules/angular2/src/core/compiler/pipeline/compile_step.map

//# sourceMappingURL=./compile_step.map