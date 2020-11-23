// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  var stringify = ``;
  if (obj === null) {
    return 'null';
  } else if (typeof obj === 'object') {
    var isArray = Array.isArray(obj);
    stringify += (isArray)? `[` : `{`;
    var firstTime = true;
    for (var key in obj) {
      var value = obj[key];
      var formatted = '';
      if (!_.isFunction(value)) {
        if (!isArray) {
          formatted += `"${key}":`;
        }
        if (typeof value === 'number') {
          formatted += `${value}`;
        } else if (typeof value === 'object') {
          formatted += `${stringifyJSON(value)}`;
        } else if (typeof value == 'string') {
          formatted += `"${value}"`;
        } else {
          formatted += value;
        }
        if (formatted !== '' && value !== undefined) {
          stringify += ((firstTime)?'' :',') + formatted;
        }
        firstTime = false;
      }
    }
    stringify += (isArray)? `]` : `}`;
  } else if (typeof obj === 'number' || typeof obj === 'boolean') {
    stringify = `${obj}`;
  } else if (typeof obj === 'string' || typeof obj === 'number') {
    stringify = `"${obj}"`;
  }

  return stringify;
};
