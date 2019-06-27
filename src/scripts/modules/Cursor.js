import { module } from 'modujs';
import Cursor from '../cursor/Cursor';


export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
      this.cursor = new Cursor();
    }


    destroy() {
      this.cursor.destroy();
    }
}
