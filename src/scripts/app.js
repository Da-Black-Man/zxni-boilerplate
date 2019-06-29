import 'normalize.css';
import '../styles/main.scss';
import "core-js/stable";
import "regenerator-runtime/runtime";
import modular from 'modujs';
import * as modules from './modules';
import globals from './globals';
import { html } from './utils/environment';

const app = new modular({
    modules: modules
});

console.log("%c||||||||||| Z X N I |||||||||||", "font-size:10px;color:#555; background-color:#6bf4a9; padding:5px;border-radius:4px;");

app.init(app);
globals();

html.classList.add('is-loaded', 'is-ready');
html.classList.remove('is-loading');

