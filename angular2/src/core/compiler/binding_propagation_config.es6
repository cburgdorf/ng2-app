import {ChangeDetector,
  CHECK_ONCE,
  DETACHED,
  CHECK_ALWAYS} from 'angular2/change_detection';
export class BindingPropagationConfig {
  constructor(cd) {
    this._cd = cd;
  }
  shouldBePropagated() {
    this._cd.mode = CHECK_ONCE;
  }
  shouldBePropagatedFromRoot() {
    this._cd.markPathToRootAsCheckOnce();
  }
  shouldNotPropagate() {
    this._cd.mode = DETACHED;
  }
  shouldAlwaysPropagate() {
    this._cd.mode = CHECK_ALWAYS;
  }
}
Object.defineProperty(BindingPropagationConfig, "parameters", {get: function() {
    return [[ChangeDetector]];
  }});

//# sourceMappingURL=/Users/tbosch/projects/angular2/modules/angular2/src/core/compiler/binding_propagation_config.map

//# sourceMappingURL=./binding_propagation_config.map