import {StringMapWrapper,
  StringMap} from 'angular2/src/facade/collection';
export class Control {
  constructor(value) {
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
Object.defineProperty(ControlGroup, "parameters", {get: function() {
    return [[StringMap]];
  }});

//# sourceMappingURL=/Users/tbosch/projects/angular2/modules/angular2/src/forms/model.map

//# sourceMappingURL=./model.map