import { module } from "modujs";
import "owl.carousel";

export default class extends module {
  constructor(m) {
    super(m);
  }

  init() {
    this.testimonial();
  }

  testimonial() {
    var $testiMain = $(".c-testimonial__slider");
    var $nextArrow = $(".c-testimonial .slider-arrow-r");
    var $prevArrow = $(".c-testimonial .slider-arrow-l");
    // var $amountContainer = $(".c-testimonial-main__counter-count");
    // var $countContainer = $(".c-testimonial-main__counter-amout");

    $testiMain
      // .on("initialized.owl.carousel", function (event) {
      //   console.log(event);
      //   var count = event.item.count;
      //   var amount = event.item.index + 1;
      //   $amountContainer.html("0" + amount);
      //   $countContainer.html("0" + count);
      // })
      .owlCarousel({
        items: 1,
        lazyLoad: false,
        loop: false,
        dots: false,
      });
    // .on("changed.owl.carousel", function (event) {
    //   var amount = event.item.index + 1;
    //   $amountContainer.html("0" + amount);

    //   var itemPhoto = $(".active")
    //     .find(".c-testimonial-main__slider-item")
    //     .attr("id");
    //   console.log(itemPhoto);
    // });

    $nextArrow.click(function () {
      $testiMain.trigger("next.owl.carousel");
    });
    $prevArrow.click(function () {
      $testiMain.trigger("prev.owl.carousel");
    });
  }
}
