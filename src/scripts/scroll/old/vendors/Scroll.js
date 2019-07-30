// ==========================================================================
// Locomotive Scroll
// ==========================================================================
/* jshint esnext: true */
import { $window, $document, $body } from '../../utils/environment';

import debounce from '../../utils/debounce';
import { isNumeric } from '../../utils/is';

export const EVENT_KEY = `LocomotiveScroll`;

export const EVENT = {
    CLICK: `click.${EVENT_KEY}`,
    ISREADY: `isReady.${EVENT_KEY}`,
    REBUILD: `rebuild.${EVENT_KEY}`,
    RENDER: `render.${EVENT_KEY}`,
    RESIZE: `resize.${EVENT_KEY}`,
    SCROLL: `scroll.${EVENT_KEY}`,
    SCROLLTO: `scrollTo.${EVENT_KEY}`,
    UPDATE: `update.${EVENT_KEY}`
};

export const DEFAULTS = {
    container: $body,
    mobileContainer: $body,
    sections: '.js-section',
    selector: '.js-animate',
    smooth: false,
    smoothMobile: false,
    reversed: false,
    getDirection: false,
    getSpeed: false,
    scrollBarClassName: 'o-scrollbar',
    isScrollingClassName: 'is-scrolling',
    isDraggingClassName: 'is-dragging',
    onScroll: function(){}
};

/**
 * Manage animation of elements on the page according to scroll position.

 * @todo  Manage some options (normally from data attributes) with constructor options (ex.: set repeat for all)
 * @todo  Method to get the distance (as percentage) of an element in the viewport
 */
export default class {
  constructor(options) {

      this.$container = (options.container) ? options.container : DEFAULTS.container;
      this.selector = (options.selector) ? options.selector : DEFAULTS.selector;

      this.callbacks = {
          onScroll: typeof options.onScroll === 'function' ? options.onScroll : DEFAULTS.onScroll
      };

      this.instance = {
          scroll: {
              x: 0,
              y: 0,
              direction: ''
          }
      };

      this.windowHeight = $window.height();
      this.windowMiddle = this.windowHeight / 2;

      this.animatedElements = [];

      this.requestId = undefined;
  }

  /**
   * Initialize scrolling animations
   */
  init() {

      this.addElements();

      this.render();

      // On scroll
      $document.on(EVENT.SCROLL, () => {
          this.render();
      });

      // Rebuild event
      $document.on(EVENT.REBUILD, () => {
          this.update();
      });

      // Update event
      $document.on(EVENT.UPDATE, (event, options) => this.update(options));

      // Render event
      $document.on(EVENT.RENDER, () => this.render());

      // Scrollto button event
      $document.on(EVENT.CLICK, '.js-scrollto', (event) => {
          event.preventDefault();

          this.scrollTo({
              sourceElem: event.currentTarget,
              offsetElem: event.currentTarget.getAttribute('data-offset')
          });
      });
      $document.on(EVENT.SCROLLTO, (event) => this.scrollTo(event.options));

      // Setup done
      $document.triggerHandler({
          type: EVENT.ISREADY
      });

      // Resize event
      $window.on(EVENT.RESIZE, debounce(() => {
          this.update();
      }, 20));

  }

  /**
   * Find all animatable elements.
   * Called on page load and any subsequent updates.
   */
  addElements() {
      this.animatedElements = [];

      const elements = document.querySelectorAll(this.selector);
      const len = elements.length;
      let i = 0;

      for (; i < len; i ++) {
          let element = elements[i];
          let elementTarget = element.getAttribute('data-target');
          let elementPosition = element.getAttribute('data-position');
          let target = (elementTarget && document.querySelectorAll(elementTarget).length) ? document.querySelectorAll(elementTarget) : element;
          let elementOffset = parseInt(target.getBoundingClientRect().top + this.instance.scroll.y);
          let elementLimit = elementOffset + target.offsetHeight;
          let elementSticky = (typeof element.getAttribute('data-sticky') === 'string');
          let elementStickyTarget = element.getAttribute('data-sticky-target');

          let elementViewportOffset = null;
          if(typeof element.getAttribute('data-viewport-offset') === 'string') {
             elementViewportOffset = element.getAttribute('data-viewport-offset').split(',');
          }
          //Manage callback
          let elementCallbackString = (typeof element.getAttribute('data-callback') === 'string') ? element.getAttribute('data-callback') : null;
          let elementCallback = null;

          if(elementCallbackString != null){
              let event = elementCallbackString.substr(0, elementCallbackString.indexOf('('));
              let optionsString = elementCallbackString.substr(elementCallbackString.indexOf('('),elementCallbackString.length - event.length);

              optionsString = optionsString.replace('(','');
              optionsString = optionsString.replace(')','');

              let options = optionsString.split('|');

              let obj = {};

              for (var j = 0; j < options.length; j++) {

                  let option = options[j].split(':');
                  option[0] = option[0].replace(' ','');

                  let val;
                  //check if value is a boolean
                  if(option[1] === "true") {
                      val = true;
                  }
                  else if(option[1] === "false") {
                      val = false;
                  }
                  //check if value is numeric
                  else if(/^\d+$/.test(option[1])) {
                      val = parseInt(option[1]);
                  }
                  //check if value is a String
                  else {
                      val = option[1];
                  }
                  obj[option[0]] = val;
              }

              elementCallback = {event:event, options:obj};
          }

          // If elements loses its animation after scrolling past it
          let elementRepeat = (typeof element.getAttribute('data-repeat') === 'string');

          let elementInViewClass = element.getAttribute('data-inview-class');
          if (typeof elementInViewClass === 'undefined') {
              elementInViewClass = 'is-show';
          }

          if (elementSticky) {
              if (!elementStickyTarget) {
                  elementLimit = this.$container[0].offsetHeight;
              } else {
                  const stickyTargetEl = document.querySelectorAll(elementStickyTarget)[0];
                  const stickyTargetBCR = stickyTargetEl.getBoundingClientRect();
                  elementLimit = stickyTargetBCR.top + document.body.scrollTop - element.offsetHeight;
              }

              // Reset offset
              element.classList.remove(elementInViewClass);
              element.classList.remove('is-unstuck');

              const transformValue = 'translate3d(0, 0, 0)';
              element.style.webkitTransform = transformValue;
              element.style.MozTransform = transformValue;
              element.style.msTransform = transformValue;
              element.style.OTransform = transformValue;
              element.style.transform = transformValue;
          }

          // Don't add element if it already has its inview class and doesn't repeat
          if (elementRepeat || !element.classList.contains(elementInViewClass)) {
              this.animatedElements[i] = {
                  element: element,
                  $element: $(element), // TEMPORARY
                  offset: Math.round(elementOffset),
                  repeat: elementRepeat,
                  position: elementPosition,
                  limit: elementLimit,
                  inViewClass: elementInViewClass,
                  sticky: elementSticky,
                  callback: elementCallback,
                  viewportOffset: elementViewportOffset
              };
          }
      };
  }

  /**
   * Loop through all animatable elements and apply animation method(s).
   */
  animateElements() {
      const len = this.animatedElements.length;
      const removeIndexes = [];
      let i = 0;
      for (; i < len; i++) {
          let element = this.animatedElements[i];

          // If the element's visibility must not be manipulated any further, remove it from the list
          if (this.toggleElement(element, i)) {
              removeIndexes.push(i);
          }
      }

      // Remove animated elements after looping through elements
      i = removeIndexes.length;
      while (i--) {
          this.animatedElements.splice(removeIndexes[i], 1);
      }
  }

  /**
   * Render the class animations, and update the global scroll positionning.
   */
  render() {
      // if (window.pageYOffset > this.instance.scroll.y) {
      //     if (this.instance.scroll.direction !== 'down') {
      //         this.instance.scroll.direction = 'down';
      //     }
      // } else if (window.pageYOffset < this.instance.scroll.y) {
      //     if (this.instance.scroll.direction !== 'up') {
      //         this.instance.scroll.direction = 'up';
      //     }
      // }

      if (this.instance.scroll.y !== window.pageYOffset) {
          this.instance.scroll.y = window.pageYOffset;
      }
      if (this.instance.scroll.x !== window.pageXOffset) {
          this.instance.scroll.x = window.pageXOffset;
      }

      this.callbacks.onScroll(this.scroll);

      this.animateElements();
  }

  /**
   * Toggle classes on an element if it's visible.
   *
   * @param  {object}      element Current element to test
   * @param  {int}         index   Index of the element within it's container
   * @return {boolean}             Wether the item must be removed from its container
   */
  toggleElement(element, index) {
      let removeFromContainer = false;

      if (typeof element !== 'undefined') {
          // Find the bottom edge of the scroll container
          const scrollTop = this.instance.scroll.y;
          const scrollBottom = scrollTop + this.windowHeight;

          // Define if the element is inView
          let inView = false;

          if (element.position === 'top') {
              inView = (scrollTop >= element.offset && scrollTop <= element.limit);
          } else if (element.position === 'below') {
              inView = (scrollTop > element.limit);
          } else if (element.sticky) {
              inView = (scrollTop >= element.offset && scrollTop <= element.limit);
          }else if(element.viewportOffset != undefined) {
              if(element.viewportOffset.length > 1) {
                  let scrollViewportOffsetTop = scrollTop + (this.windowHeight * element.viewportOffset[1]);
                  let scrollViewportOffsetBottom = scrollBottom - (this.windowHeight * element.viewportOffset[0]);
                  inView = (scrollViewportOffsetBottom > element.offset && scrollViewportOffsetTop < element.limit);

              } else {
                  let scrollViewportOffset = scrollBottom - (this.windowHeight * element.viewportOffset[0]);
                  inView = (scrollViewportOffset > element.offset && scrollViewportOffset < element.limit);
              }
          }else {
              inView = (scrollBottom >= element.offset && scrollTop <= element.limit);
          }

          if (element.sticky) {
              if (scrollTop > element.limit) {
                  element.element.classList.add('is-unstuck');
              } else {
                  element.element.classList.remove('is-unstuck');
              }

              if (scrollTop < element.offset) {
                  element.element.classList.remove(element.inViewClass);
              }
          }

          // Add class if inView, remove if not
          if (inView) {
              if(!element.element.classList.contains(element.inViewClass)){
                  element.element.classList.add(element.inViewClass);
                  this.triggerCallback(element,'enter');
              }

              if (!element.repeat && !element.sticky) {
                  removeFromContainer = true;
              }

              if (element.sticky) {
                  let y = this.instance.scroll.y - element.offset;

                  const transformValue = `translate3d(0, ${y}px, 0)`;
                  element.element.style.webkitTransform = transformValue;
                  element.element.style.MozTransform = transformValue;
                  element.element.style.msTransform = transformValue;
                  element.element.style.OTransform = transformValue;
                  element.element.style.transform = transformValue;
              }
          } else {
              if (element.repeat) {
                  if(element.element.classList.contains(element.inViewClass)){
                      element.element.classList.remove(element.inViewClass);
                      this.triggerCallback(element,'leave');
                  }
              }
          }
      }

      return removeFromContainer;
  }

  /**
   * check if the element have a callback, and trigger the event set in the data-callback
   *
   * @param  {object}      element Current element to test
   * @return void
   */
  triggerCallback(element,way){

      if(element.callback != undefined){
          $(element.element).trigger({
              type: element.callback.event,
              options: element.callback.options,
              way: way
          });
          //add this where you want dude (in your module btw)
          // $document.on(event.Namespace,(e)=>{
          //     console.log(e.options, e.way);
          // });
          /////////////////////////////////////////////
      }
  }

  /**
   * Scroll to a desired target.
   *
   * @param  {object} options
   *      Available options :
   *          {node} targetElem - The DOM element we want to scroll to
   *          {node} sourceElem - An `<a>` element with an href targeting the anchor we want to scroll to
   *          {node} offsetElem - A DOM element from which we get the height to substract from the targetOffset
   *              (ex: use offsetElem to pass a mobile header that is above content, to make sure the scrollTo will be aligned with it)
   *          {int} targetOffset - An absolute vertical scroll value to reach, or an offset to apply on top of given `targetElem` or `sourceElem`'s target
   *          {int} delay - Amount of milliseconds to wait before starting to scroll
   *          {boolean} toTop - Set to true to scroll all the way to the top
   *          {boolean} toBottom - Set to true to scroll all the way to the bottom
   *          {float} speed - Duration of the scroll
   * @return {void}
   */
  scrollTo(options) {
      let targetElem = options.targetElem;
      const sourceElem = options.sourceElem;
      const offsetElem = options.offsetElem;
      let targetOffset = isNumeric(options.targetOffset) ? parseInt(options.targetOffset) : 0;
      const delay = isNumeric(options.delay) ? parseInt(options.delay) : 0;
      const speed = isNumeric(options.speed) ? parseInt(options.speed) : 800;
      const toTop = options.toTop;
      const toBottom = options.toBottom;
      let offset = 0;

      // Make sure at least one of the required options has beeen filled
      if (!toTop && !toBottom && !isNumeric(options.targetOffset) && !targetElem && !sourceElem) {
          console.warn(`You must specify at least one of these parameters:`, [
              '{boolean} toTop - Set to true to scroll all the way to the top',
              '{boolean} toBottom - Set to true to scroll all the way to the bottom',
              '{int} targetOffset - An absolute vertical scroll value to reach, or an offset to apply on top of given `targetElem` or `sourceElem`\'s target',
              '{node} targetElem - The DOM element we want to scroll to',
              '{node} sourceElem - An `<a>` element with an href targeting the anchor we want to scroll to'
          ]);
          return false;
      }

      // If sourceElem is given, find and store the targetElem it's related to
      if (sourceElem) {
          let targetData = '';

          console.log(sourceElem);

          // Get the selector (given with `data-target` or `href` attributes on sourceElem)
          let sourceElemTarget = sourceElem.getAttribute('data-target');
          targetData = sourceElemTarget ? sourceElemTarget : sourceElem.getAttribute('href');

          // Store the target for later
          targetElem = document.querySelectorAll(targetData)[0];
      }

      // We have a targetElem, get it's coordinates
      if (targetElem) {
          // Get targetElem offset from top
          const targetElemBCR = targetElem.getBoundingClientRect();
          const targetElemOffsetTop = targetElemBCR.top + document.documentElement.scrollTop; // TODO - Improve current scroll position source, might not always be documentElement

          // Final value of scroll destination : targetElemOffsetTop + (optional offset given in options)
          targetOffset = targetElemOffsetTop + targetOffset;
      }

      // We have an offsetElem, get its height and remove it from targetOffset already computed
      if (offsetElem) {
          let offset = offsetElem.offsetHeight;
          targetOffset = targetOffset - offset;
      }

      // If we want to go to one of boundaries
      if (toTop === true) {
          targetOffset = 0;
      } else if (toBottom === true) {
          targetOffset = document.body.offsetHeight; // TODO - Improve container height source, might not always be the body
      }

      setTimeout(() => {
          $('html, body').animate({ // TODO - Remove jQuery here
              scrollTop: targetOffset
          }, speed);
      }, delay);
  }

  /**
   * Update elements and recalculate all the positions on the page
   */
  update() {
      this.addElements();
      this.animateElements();

      this.windowHeight = $window.height();
      this.windowMiddle = this.windowHeight / 2;
  }

  /**
   * Destroy
   */
  destroy() {
      $window.off(`.${EVENT_KEY}`);
      this.$container.off(`.${EVENT_KEY}`);
      window.cancelAnimationFrame(this.requestId);
      this.requestId = undefined;
      this.animatedElements = undefined;
  }
}
