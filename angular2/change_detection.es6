import {assert} from "rtts_assert/rtts_assert";
export {AST} from './src/change_detection/parser/ast';
export {Lexer} from './src/change_detection/parser/lexer';
export {Parser} from './src/change_detection/parser/parser';
export {ContextWithVariableBindings} from './src/change_detection/parser/context_with_variable_bindings';
export {ExpressionChangedAfterItHasBeenChecked, ChangeDetectionError} from './src/change_detection/exceptions';
export {ChangeRecord, ChangeDispatcher, ChangeDetector, CHECK_ONCE, CHECK_ALWAYS, DETACHED, CHECKED} from './src/change_detection/interfaces';
export {ProtoChangeDetector, DynamicProtoChangeDetector, JitProtoChangeDetector} from './src/change_detection/proto_change_detector';
export {DynamicChangeDetector} from './src/change_detection/dynamic_change_detector';
import {ProtoChangeDetector,
  DynamicProtoChangeDetector,
  JitProtoChangeDetector} from './src/change_detection/proto_change_detector';
export class ChangeDetection {
  createProtoChangeDetector(name) {
    assert.argumentTypes(name, assert.type.string);
    return assert.returnType((null), ProtoChangeDetector);
  }
}
Object.defineProperty(ChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class DynamicChangeDetection extends ChangeDetection {
  createProtoChangeDetector(name) {
    assert.argumentTypes(name, assert.type.string);
    return assert.returnType((new DynamicProtoChangeDetector()), ProtoChangeDetector);
  }
}
Object.defineProperty(DynamicChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export class JitChangeDetection extends ChangeDetection {
  createProtoChangeDetector(name) {
    assert.argumentTypes(name, assert.type.string);
    return assert.returnType((new JitProtoChangeDetector()), ProtoChangeDetector);
  }
}
Object.defineProperty(JitChangeDetection.prototype.createProtoChangeDetector, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
export var dynamicChangeDetection = new DynamicChangeDetection();
export var jitChangeDetection = new JitChangeDetection();

//# sourceMappingURL=/Users/cburgdorf/Documents/hacking/angular/modules/angular2/change_detection.map

//# sourceMappingURL=./change_detection.map