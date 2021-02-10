import { module } from "modujs";
import LocomotiveScroll from "locomotive-scroll";
import { html } from "../utils/environment";

export default class extends module {
  constructor(m) {
    super(m);
  }

  init() {
    setTimeout(() => {
      this.scroll = new LocomotiveScroll({
        el: this.el,
        smooth: false,
      });

      this.scroll.on("call", (func, way, obj, id) => {
        // Using modularJS
        this.call(
          func[0],
          {
            way,
            obj,
          },
          func[1],
          func[2]
        );
      });

      this.scroll.on("scroll", (args) => {
        // console.log(args.scroll.y);

        // args.scroll.y > 20
        //   ? html.classList.add("has-scrolled")
        //   : html.classList.remove("has-scrolled");
        window.scrollY > 20
          ? html.classList.add("has-scrolled")
          : html.classList.remove("has-scrolled");
        args.scroll.y > 300
          ? html.classList.add("has-nav")
          : html.classList.remove("has-nav");
      });
    }, 500);
  }

  toggleLazy(args) {
    let src = this.getData("lazy", args.obj.el);
    if (src.length) {
      if (args.obj.el.tagName == "IMG") {
        args.obj.el.src = src;
      } else {
        args.obj.el.style.backgroundImage = `url(${src})`;
      }
      this.setData("lazy", "", args.obj.el);
    }
  }

  destroy() {
    this.scroll.destroy();
  }
}
