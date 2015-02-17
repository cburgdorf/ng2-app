import {assert} from "rtts_assert/rtts_assert";
import {StringMapWrapper} from 'angular2/src/facade/collection';
export class Control {
  constructor(value) {
    assert.argumentTypes(value, assert.type.any);
    this.value = value;
  }
}
Object.defineProperty(Control, "parameters", {get: function() {
    return [[assert.type.any]];
  }});
export class ControlGroup {
  constructor(controls) {
    this.controls = controls;
  }
  get value() {
    var res = {};
    StringMapWrapper.forEach(this.controls, (control, name) => {
      res[name] = control.value;
    });
    return res;
  }
}

//# sourceMappingURL=/Users/cburgdorf/Documents/hacking/angular/modules/angular2/src/forms/model.map

//# sourceMappingURL=./model.map