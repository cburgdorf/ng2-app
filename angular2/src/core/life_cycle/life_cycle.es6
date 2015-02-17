import {assert} from "rtts_assert/rtts_assert";
import {FIELD,
  print} from 'angular2/src/facade/lang';
import {ChangeDetector} from 'angular2/change_detection';
import {VmTurnZone} from 'angular2/src/core/zone/vm_turn_zone';
import {ListWrapper} from 'angular2/src/facade/collection';
import {isPresent} from 'angular2/src/facade/lang';
export class LifeCycle {
  constructor(changeDetector = null, enforceNoNewChanges = false) {
    assert.argumentTypes(changeDetector, ChangeDetector, enforceNoNewChanges, assert.type.boolean);
    this._changeDetector = changeDetector;
    this._enforceNoNewChanges = enforceNoNewChanges;
  }
  registerWith(zone, changeDetector = null) {
    var errorHandler = (exception, stackTrace) => {
      var longStackTrace = ListWrapper.join(stackTrace, "\n\n-----async gap-----\n");
      print(`${exception}\n\n${longStackTrace}`);
      throw exception;
    };
    if (isPresent(changeDetector)) {
      this._changeDetector = changeDetector;
    }
    zone.initCallbacks({
      onErrorHandler: errorHandler,
      onTurnDone: () => this.tick()
    });
  }
  tick() {
    this._changeDetector.detectChanges();
    if (this._enforceNoNewChanges) {
      this._changeDetector.checkNoChanges();
    }
  }
}
Object.defineProperty(LifeCycle, "parameters", {get: function() {
    return [[ChangeDetector], [assert.type.boolean]];
  }});
Object.defineProperty(LifeCycle.prototype.registerWith, "parameters", {get: function() {
    return [[VmTurnZone], [ChangeDetector]];
  }});

//# sourceMappingURL=/Users/cburgdorf/Documents/hacking/angular/modules/angular2/src/core/life_cycle/life_cycle.map

//# sourceMappingURL=./life_cycle.map