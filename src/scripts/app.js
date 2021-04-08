import "normalize.css";
import "../styles/main.scss";

// @todo Look into pollyfill if this is correct placement

// import "core-js/stable";
// import "regenerator-runtime/runtime";
// import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';

import modular from "modujs";
import * as modules from "./modules";
import globals from "./globals";
import { html } from "./utils/environment";

console.log(
  "%c||||||||||| Paradox.ai |||||||||||",
  "font-size:10px;color:#555; background-color:#25c9d0; padding:5px;border-radius:4px;"
);

class Zxni {
  constructor() {
    html.classList.add("is-loading");
    window.addEventListener("load", () => {
      this.init();
    });
  }

  init() {
    const app = new modular({
      modules: modules,
    });
    app.init(app);
    globals();
    html.classList.add("is-loaded", "is-ready");
    html.classList.remove("is-loading");
  }
}

// IIFE for loading the application
// ==========================================================================
(function () {
  new Zxni();
})();
