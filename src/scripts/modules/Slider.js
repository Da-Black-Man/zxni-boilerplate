import { module } from "modujs";
import "owl.carousel";

export default class extends module {
  constructor(m) {
    super(m);
  }

  init() {
    this.slider();
  }

  slider() {
    var $sliderMain = $(".c-slider-info__main");
    var $nextArrow = $(".c-slider-info .slider-arrow-r");
    var $prevArrow = $(".c-slider-info .slider-arrow-l");

    $sliderMain.owlCarousel({
      items: 1,
      lazyLoad: false,
      loop: false,
      dots: false,
    });

    $nextArrow.click(function () {
      $sliderMain.trigger("next.owl.carousel");
    });
    $prevArrow.click(function () {
      $sliderMain.trigger("prev.owl.carousel");
    });
  }
}
