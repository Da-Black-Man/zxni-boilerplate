import { module } from 'modujs';
import { TweenMax } from 'gsap/TweenMax';


export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
      $('a.-social-hub').on('click',function(event){
        event.preventDefault();
        $('a.-social-hub').addClass('--open');
        $(this).parent().parent().find('a').not('.-social-hub').each(function(index){
          if(!$(this).hasClass('show')){
            $(this).addClass('show');
            TweenMax.to($(this), 0.4, {y:((index-5)*-10), autoAlpha:1});
          }else{
            TweenMax.staggerTo($(this), 0.2, {y:0, autoAlpha:0}, 0.1, function(){
              $('.c-main-hero__social-list a').removeClass('show');
              $('a.-social-hub').removeClass('--open');
            });
          }
        });
      });
    }
}
