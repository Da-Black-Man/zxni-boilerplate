import 'normalize.css';
import '../styles/main.scss';
import "core-js/stable";
import "regenerator-runtime/runtime";
import modular from 'modujs';
import * as modules from './modules';
import globals from './globals';
import { html } from './utils/environment';


console.log("%c||||||||||| Z X N I |||||||||||", "font-size:10px;color:#555; background-color:#6bf4a9; padding:5px;border-radius:4px;");




class Zxni {
  constructor() {
    window.addEventListener('load',() => {
      html.classList.add('is-loaded', 'is-ready');
      this.init();
    });
  }

  init() {
    const app = new modular({
      modules: modules
    });
    app.init(app);
    globals();
  }

}


// IIFE for loading the application
// ==========================================================================
(function() {
  new Zxni();
})();

