
import {bootstrap,
  Component,
  Decorator,
  Template,
  NgElement} from '../angular2/angular2';


import {Person} from './model/Person';

global.app = function () {
    var christoph = new Person('Christoph', 'Burgdorf');
    console.log(christoph.fullName);
};