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

app.init(app);
globals();

html.classList.add('is-loaded', 'is-ready');
html.classList.remove('is-loading');

