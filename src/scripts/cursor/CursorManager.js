import { gsap } from "gsap";

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


    this.outerCursorBox = this.outerCursor.getBoundingClientRect();
    this.outerCursorSpeed = 0;
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
      gsap.set(this.innerCursor, {
        x: this.clientX,
        y: this.clientY
      });
      gsap.set(this.outerCursor, {
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
      gsap.set(this.innerCursor, {
        x: this.clientX,
        y: this.clientY
      });
      if (!this.isStuck) {
        gsap.to(this.outerCursor, this.outerCursorSpeed, {
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

    const LinkItems = gsap.to(this.outerCursor, 0.5, {
      backgroundColor: "#000000",
      scale: 0.3,
      opacity: 1,
      ease: "back",
      paused: true
    });

    const handleMouseEnter = () => {
      this.outerCursorSpeed = 0;
      gsap.set(this.innerCursor, {
        opacity: 0
      });
      LinkItems.play();
    };

    const handleMouseLeave = () => {
      this.outerCursorSpeed = 0.2;
      gsap.set(this.innerCursor, {
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
