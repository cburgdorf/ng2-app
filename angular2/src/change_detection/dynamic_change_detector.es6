import {assert} from "rtts_assert/rtts_assert";
import {isPresent,
  isBlank,
  BaseException,
  FunctionWrapper} from 'angular2/src/facade/lang';
import {List,
  ListWrapper,
  MapWrapper,
  StringMapWrapper} from 'angular2/src/facade/collection';
import {ContextWithVariableBindings} from './parser/context_with_variable_bindings';
import {AbstractChangeDetector} from './abstract_change_detector';
import {ChangeDetectionUtil,
  SimpleChange,
  uninitialized} from './change_detection_util';
import {ArrayChanges} from './array_changes';
import {KeyValueChanges} from './keyvalue_changes';
import {ProtoRecord,
  RECORD_TYPE_SELF,
  RECORD_TYPE_PROPERTY,
  RECORD_TYPE_INVOKE_METHOD,
  RECORD_TYPE_CONST,
  RECORD_TYPE_INVOKE_CLOSURE,
  RECORD_TYPE_PRIMITIVE_OP,
  RECORD_TYPE_KEYED_ACCESS,
  RECORD_TYPE_INVOKE_FORMATTER,
  RECORD_TYPE_STRUCTURAL_CHECK,
  RECORD_TYPE_INTERPOLATE,
  ProtoChangeDetector} from './proto_change_detector';
import {ChangeDetector,
  ChangeDispatcher} from './interfaces';
import {ExpressionChangedAfterItHasBeenChecked,
  ChangeDetectionError} from './exceptions';
export class DynamicChangeDetector extends AbstractChangeDetector {
  constructor(dispatcher, formatters, protoRecords) {
    assert.argumentTypes(dispatcher, assert.type.any, formatters, Map, protoRecords, assert.genericType(List, ProtoRecord));
    super();
    this.dispatcher = dispatcher;
    this.formatters = formatters;
    this.values = ListWrapper.createFixedSize(protoRecords.length + 1);
    this.changes = ListWrapper.createFixedSize(protoRecords.length + 1);
    this.protos = protoRecords;
  }
  setContext(context) {
    assert.argumentTypes(context, assert.type.any);
    ListWrapper.fill(this.values, uninitialized);
    this.values[0] = context;
  }
  detectChangesInRecords(throwOnChange) {
    assert.argumentTypes(throwOnChange, assert.type.boolean);
    var protos = assert.type(this.protos, assert.genericType(List, ProtoRecord));
    var updatedRecords = null;
    for (var i = 0; i < protos.length; ++i) {
      var proto = assert.type(protos[i], ProtoRecord);
      var change = this._check(proto);
      if (isPresent(change)) {
        var record = ChangeDetectionUtil.changeRecord(proto.bindingMemento, change);
        updatedRecords = ChangeDetectionUtil.addRecord(updatedRecords, record);
      }
      if (proto.lastInDirective && isPresent(updatedRecords)) {
        if (throwOnChange)
          ChangeDetectionUtil.throwOnChange(proto, updatedRecords[0]);
        this.dispatcher.onRecordChange(proto.directiveMemento, updatedRecords);
        updatedRecords = null;
      }
    }
  }
  _check(proto) {
    assert.argumentTypes(proto, ProtoRecord);
    try {
      if (proto.mode == RECORD_TYPE_STRUCTURAL_CHECK) {
        return this._structuralCheck(proto);
      } else {
        return this._referenceCheck(proto);
      }
    } catch (e) {
      throw new ChangeDetectionError(proto, e);
    }
  }
  _referenceCheck(proto) {
    assert.argumentTypes(proto, ProtoRecord);
    if (this._pureFuncAndArgsDidNotChange(proto)) {
      this._setChanged(proto, false);
      return null;
    }
    var prevValue = this._readSelf(proto);
    var currValue = this._calculateCurrValue(proto);
    if (!isSame(prevValue, currValue)) {
      this._writeSelf(proto, currValue);
      this._setChanged(proto, true);
      if (proto.lastInBinding) {
        return ChangeDetectionUtil.simpleChange(prevValue, currValue);
      } else {
        return null;
      }
    } else {
      this._setChanged(proto, false);
      return null;
    }
  }
  _calculateCurrValue(proto) {
    assert.argumentTypes(proto, ProtoRecord);
    switch (proto.mode) {
      case RECORD_TYPE_SELF:
        return this._readContext(proto);
      case RECORD_TYPE_CONST:
        return proto.funcOrValue;
      case RECORD_TYPE_PROPERTY:
        var context = this._readContext(proto);
        var c = ChangeDetectionUtil.findContext(proto.name, context);
        if (c instanceof ContextWithVariableBindings) {
          return c.get(proto.name);
        } else {
          var propertyGetter = assert.type(proto.funcOrValue, Function);
          return propertyGetter(c);
        }
        break;
      case RECORD_TYPE_INVOKE_METHOD:
        var methodInvoker = assert.type(proto.funcOrValue, Function);
        return methodInvoker(this._readContext(proto), this._readArgs(proto));
      case RECORD_TYPE_KEYED_ACCESS:
        var arg = this._readArgs(proto)[0];
        return this._readContext(proto)[arg];
      case RECORD_TYPE_INVOKE_CLOSURE:
        return FunctionWrapper.apply(this._readContext(proto), this._readArgs(proto));
      case RECORD_TYPE_INTERPOLATE:
      case RECORD_TYPE_PRIMITIVE_OP:
        return FunctionWrapper.apply(proto.funcOrValue, this._readArgs(proto));
      case RECORD_TYPE_INVOKE_FORMATTER:
        var formatter = MapWrapper.get(this.formatters, proto.funcOrValue);
        return FunctionWrapper.apply(formatter, this._readArgs(proto));
      default:
        throw new BaseException(`Unknown operation ${proto.mode}`);
    }
  }
  _structuralCheck(proto) {
    assert.argumentTypes(proto, ProtoRecord);
    var self = this._readSelf(proto);
    var context = this._readContext(proto);
    var change = ChangeDetectionUtil.structuralCheck(self, context);
    if (isPresent(change)) {
      this._writeSelf(proto, change.currentValue);
    }
    return change;
  }
  _readContext(proto) {
    assert.argumentTypes(proto, ProtoRecord);
    return this.values[proto.contextIndex];
  }
  _readSelf(proto) {
    assert.argumentTypes(proto, ProtoRecord);
    return this.values[proto.selfIndex];
  }
  _writeSelf(proto, value) {
    assert.argumentTypes(proto, ProtoRecord, value, assert.type.any);
    this.values[proto.selfIndex] = value;
  }
  _setChanged(proto, value) {
    assert.argumentTypes(proto, ProtoRecord, value, assert.type.boolean);
    this.changes[proto.selfIndex] = value;
  }
  _pureFuncAndArgsDidNotChange(proto) {
    assert.argumentTypes(proto, ProtoRecord);
    return assert.returnType((proto.isPureFunction() && !this._argsChanged(proto)), assert.type.boolean);
  }
  _argsChanged(proto) {
    assert.argumentTypes(proto, ProtoRecord);
    var args = proto.args;
    for (var i = 0; i < args.length; ++i) {
      if (this.changes[args[i]]) {
        return assert.returnType((true), assert.type.boolean);
      }
    }
    return assert.returnType((false), assert.type.boolean);
  }
  _readArgs(proto) {
    assert.argumentTypes(proto, ProtoRecord);
    var res = ListWrapper.createFixedSize(proto.args.length);
    var args = proto.args;
    for (var i = 0; i < args.length; ++i) {
      res[i] = this.values[args[i]];
    }
    return res;
  }
}
Object.defineProperty(DynamicChangeDetector, "parameters", {get: function() {
    return [[assert.type.any], [Map], [assert.genericType(List, ProtoRecord)]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype.setContext, "parameters", {get: function() {
    return [[assert.type.any]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype.detectChangesInRecords, "parameters", {get: function() {
    return [[assert.type.boolean]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._check, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._referenceCheck, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._calculateCurrValue, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._structuralCheck, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._readContext, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._readSelf, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._writeSelf, "parameters", {get: function() {
    return [[ProtoRecord], []];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._setChanged, "parameters", {get: function() {
    return [[ProtoRecord], [assert.type.boolean]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._pureFuncAndArgsDidNotChange, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._argsChanged, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
Object.defineProperty(DynamicChangeDetector.prototype._readArgs, "parameters", {get: function() {
    return [[ProtoRecord]];
  }});
var _singleElementList = [null];
function isSame(a, b) {
  if (a === b)
    return true;
  if (a instanceof String && b instanceof String && a == b)
    return true;
  if ((a !== a) && (b !== b))
    return true;
  return false;
}

//# sourceMappingURL=/Users/cburgdorf/Documents/hacking/angular/modules/angular2/src/change_detection/dynamic_change_detector.map

//# sourceMappingURL=./dynamic_change_detector.map