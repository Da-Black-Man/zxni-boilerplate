import { module } from 'modujs';
import { $document } from '../utils/environment';
import ScrollManager from '../scroll/vendors/ScrollManager';

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        this.scroll = new ScrollManager({
            container: $(this.el),
            sections: '.js-section',
            selector: '.js-animate',
            smooth: true,
            smoothMobile: true,
            mobileContainer: $(document),
            getDirection: true,
            getSpeed: true,
            inertia: 1,
            scrollBarClassName: 'o-scrollbar',
            isScrollingClassName: 'is-scrolling',
            onScroll: (e) => {
                // console.log(e.scroll.y);
            }
        });
    }

    destroy() {
        this.scroll.destroy();
    }
}
