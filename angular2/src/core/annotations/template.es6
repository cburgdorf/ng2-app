import {ABSTRACT,
  CONST,
  Type} from 'angular2/src/facade/lang';
import {List} from 'angular2/src/facade/collection';
export class Template {
  constructor({url,
    inline,
    directives,
    formatters,
    source,
    locale,
    device}) {
    this.url = url;
    this.inline = inline;
    this.directives = directives;
    this.formatters = formatters;
    this.source = source;
    this.locale = locale;
    this.device = device;
  }
}
Object.defineProperty(Template, "annotations", {get: function() {
    return [new CONST()];
  }});

//# sourceMappingURL=/Users/cburgdorf/Documents/hacking/angular/modules/angular2/src/core/annotations/template.map

//# sourceMappingURL=./template.map