import {HammerGesturesPluginCommon} from './hammer_common';
import {Element} from 'angular2/src/facade/dom';
import {isPresent,
  BaseException} from 'angular2/src/facade/lang';
export class HammerGesturesPlugin extends HammerGesturesPluginCommon {
  constructor() {
    super();
  }
  supports(eventName) {
    if (!super.supports(eventName))
      return false;
    if (!isPresent(window.Hammer)) {
      throw new BaseException(`Hammer.js is not loaded, can not bind ${eventName} event`);
    }
    return true;
  }
  addEventListener(element, eventName, handler) {
    var zone = this.manager.getZone();
    eventName = eventName.toLowerCase();
    zone.runOutsideAngular(function() {
      var mc = new Hammer(element);
      mc.get('pinch').set({enable: true});
      mc.get('rotate').set({enable: true});
      mc.on(eventName, function(eventObj) {
        zone.run(function() {
          handler(eventObj);
        });
      });
    });
  }
}
Object.defineProperty(HammerGesturesPlugin.prototype.supports, "parameters", {get: function() {
    return [[assert.type.string]];
  }});
Object.defineProperty(HammerGesturesPlugin.prototype.addEventListener, "parameters", {get: function() {
    return [[Element], [assert.type.string], [Function]];
  }});

//# sourceMappingURL=/Users/tbosch/projects/angular2/modules/angular2/src/core/events/hammer_gestures.map

//# sourceMappingURL=./hammer_gestures.map