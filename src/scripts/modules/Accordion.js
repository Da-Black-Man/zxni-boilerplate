import { module } from "modujs";

export default class extends module {
  constructor(m) {
    super(m);
  }

  init() {
    var Accordion = (function () {
      var toggleItems, items;

      var _init = function () {
        toggleItems = document.querySelectorAll(".c-faq-min__item");
        toggleItems = Array.prototype.slice.call(toggleItems);
        items = document.querySelectorAll(".c-faq-min__item_click__JS");
        items = Array.prototype.slice.call(items);

        _addEventHandlers();
        TweenLite.set(items, {
          visibility: "visible",
        });
      };

      var _addEventHandlers = function () {
        items.forEach(function (element, index) {
          element.addEventListener("click", _toggleItem, false);
        });
      };

      var _toggleItem = function () {
        var parent = this.parentNode;
        var content = parent.children[1];

        if (!parent.classList.contains("is-active")) {
          parent.classList.add("is-active");
          TweenLite.set(content, {
            height: "auto",
          });
          TweenLite.from(content, 0.6, {
            height: 0,
            immediateRender: false,
            ease: Back.easeOut,
          });
        } else {
          parent.classList.remove("is-active");
          TweenLite.to(content, 0.3, {
            height: 0,
            immediateRender: false,
            ease: Power1.easeOut,
          });
        }
      };

      return {
        init: _init,
      };
    })();

    Accordion.init();
  }
}
