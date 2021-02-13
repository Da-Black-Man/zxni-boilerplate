const toString = Object.prototype.toString;
const arrayLikePattern = /^\[object (?:Array|FileList)\]$/;

// thanks, http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
export function isArray(thing) {
  return toString.call(thing) === '[object Array]';
}

export function isArrayLike(obj) {
  return arrayLikePattern.test(toString.call(obj));
}

export function isEqual(a, b) {
  if (a === null && b === null) {
    return true;
  }

  if (typeof a === 'object' || typeof b === 'object') {
    return false;
  }

  return a === b;
}

// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
export function isNumeric(thing) {
  return !isNaN(parseFloat(thing)) && isFinite(thing);
}

export function isObject(thing) {
  return (thing && toString.call(thing) === '[object Object]');
}

export function isFunction(thing) {
  const getType = {};
  return thing && getType.toString.call(thing) === '[object Function]';
}


// Get IE or Edge browser version

export function isIE() {
  var version = detectIE();
  var root = document.documentElement;


  if (version === false) {
    return;
  } else if (version >= 12) {
    root.className += ' is-edge ' + version;
  } else {
    root.className += ' is-ie ' + version;
  }


}

function detectIE() {
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}
