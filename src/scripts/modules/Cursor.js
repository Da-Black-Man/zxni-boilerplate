import { module } from 'modujs';
import { html } from '../utils/environment';
import Cursor from '../cursor/CursorManager';


export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
      this.cursor = new Cursor({
        outerCursor: '.o-cursor-circle__outer',
        innerCursor: '.o-cursor-circle__inner',
        showCursor: false
      });
    }


    destroy() {
      super.destroy();
      html.classList.remove('has-custom-cursor');
    }
}
