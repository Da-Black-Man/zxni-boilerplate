import { module } from "modujs";
import "owl.carousel";

export default class extends module {
  constructor(m) {
    super(m);
  }

  init() {
    this.heroSlider();
  }

  heroSlider() {
    var $sliderMain = $(".c-hero-slider__main");
    var $nextArrow = $(".c-hero-slider .slider-arrow-r");
    var $prevArrow = $(".c-hero-slider .slider-arrow-l");

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
