import { TweenMax } from 'gsap/TweenMax';

export const DEFAULTS = {
  outerCursor: '.o-cursor-circle__outer',
  innerCursor: '.o-cursor-circle__inner',
  showCursor: false
};


export default class {
  constructor(options) {
    this.outerCursor = (options.outerCursor) ? document.querySelector(options.outerCursor) : document.querySelector(DEFAULTS.outerCursor);
    this.innerCursor = (options.innerCursor) ? document.querySelector(options.innerCursor) : document.querySelector(DEFAULTS.innerCursor);
    this.showCursor = options.showCursor || DEFAULTS.showCursor;


    const { Back } = window;
    this.outerCursorBox = this.outerCursor.getBoundingClientRect();
    this.outerCursorSpeed = 0;
    this.easing = Back.easeInOut.config(1.7);
    this.clientX = -100;
    this.clientY = -100;
    this.activeCursor = false;

    this.init();
  }

  init() {
    this.cursor = (() => {
      if (this.showCursor === true) {
        this.initCursor();
        this.initHovers();
      }
  })();



  }



  initCursor() {
    document.documentElement.classList.add('has-custom-cursor');
    const unveilCursor = () => {
      TweenMax.set(this.innerCursor, {
        x: this.clientX,
        y: this.clientY
      });
      TweenMax.set(this.outerCursor, {
        x: this.clientX - this.outerCursorBox.width / 2,
        y: this.clientY - this.outerCursorBox.height / 2
      });
      setTimeout(() => {
        this.outerCursorSpeed = 0.2;
      }, 100);
      this.activeCursor = true;
    };
    document.addEventListener("mousemove", unveilCursor);

    document.addEventListener("mousemove", e => {
      this.clientX = e.clientX;
      this.clientY = e.clientY;
    });

    const render = () => {
      TweenMax.set(this.innerCursor, {
        x: this.clientX,
        y: this.clientY
      });
      if (!this.isStuck) {
        TweenMax.to(this.outerCursor, this.outerCursorSpeed, {
          x: this.clientX - this.outerCursorBox.width / 2,
          y: this.clientY - this.outerCursorBox.height / 2
        });
      }
      if (this.activeCursor) {
        document.removeEventListener("mousemove", unveilCursor);
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  initHovers() {

    const LinkItems = TweenMax.to(this.outerCursor, 0.5, {
      backgroundColor: "#000000",
      scale: 0.3,
      opacity: 1,
      ease: this.easing,
      paused: true
    });

    const handleMouseEnter = () => {
      this.outerCursorSpeed = 0;
      TweenMax.set(this.innerCursor, {
        opacity: 0
      });
      LinkItems.play();
    };

    const handleMouseLeave = () => {
      this.outerCursorSpeed = 0.2;
      TweenMax.set(this.innerCursor, {
        opacity: 1
      });
      LinkItems.reverse();
    };

    const mainNavLinks = document.querySelectorAll(".has-custom-cursor a");
    mainNavLinks.forEach(item => {
      item.addEventListener("mouseenter", handleMouseEnter);
      item.addEventListener("mouseleave", handleMouseLeave);
    });
  }


}
