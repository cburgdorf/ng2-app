export {AST} from './src/change_detection/parser/ast';
export {Lexer} from './src/change_detection/parser/lexer';
export {Parser} from './src/change_detection/parser/parser';
export {ContextWithVariableBindings} from './src/change_detection/parser/context_with_variable_bindings';
export {ExpressionChangedAfterItHasBeenChecked, ChangeDetectionError} from './src/change_detection/exceptions';
export {ChangeRecord, ChangeDispatcher, ChangeDetector, CHECK_ONCE, CHECK_ALWAYS, DETACHED, CHECKED} from './src/change_detection/interfaces';
export {ProtoChangeDetector, DynamicProtoChangeDetector, JitProtoChangeDetector} from './src/change_detection/proto_change_detector';
export {DynamicChangeDetector} from './src/change_detection/dynamic_change_detector';
export * from './src/change_detection/pipes/pipe_registry';
export * from './src/change_detection/pipes/pipe';
import {ProtoChangeDetector,
  DynamicProtoChangeDetector,
  JitProtoChangeDetector} from './src/change_detection/proto_change_detector';
import {PipeRegistry} from './src/change_detection/pipes/pipe_registry';
import {ArrayChanges} from './src/change_detection/pipes/array_changes';
import {NullPipe} from './src/change_detection/pipes/null_pipe';
export class ChangeDetection {
  createProtoChangeDetector(name) {
    return null;
  }
}
Object.defineProperty(ChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export var defaultPipes = {"[]": [{
    "supports": ArrayChanges.supportsObj,
    "pipe": () => new ArrayChanges()
  }, {
    "supports": NullPipe.supportsObj,
    "pipe": () => new NullPipe()
  }]};
var _registry = new PipeRegistry(defaultPipes);
export class DynamicChangeDetection extends ChangeDetection {
  createProtoChangeDetector(name) {
    return new DynamicProtoChangeDetector(_registry);
  }
}
Object.defineProperty(DynamicChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class JitChangeDetection extends ChangeDetection {
  createProtoChangeDetector(name) {
    return new JitProtoChangeDetector(_registry);
  }
}
Object.defineProperty(JitChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export var dynamicChangeDetection = new DynamicChangeDetection();
export var jitChangeDetection = new JitChangeDetection();

//# sourceMappingURL=/Users/tbosch/projects/angular2/modules/angular2/change_detection.map

//# sourceMappingURL=./change_detection.map