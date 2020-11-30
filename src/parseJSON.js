// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON_debug = function(json, debugState) {
  var str = json;
  result = json;
  var illegalChars = /[\u0021-\u002f\u003a-\u0040\u005b-\u005e\u0060\u007b-\u007e]/g;
  var debug = {};
  if (debugState) {
    debug.log = console.log;
  } else {
     debug.log = function(text) {};
  }

  var stringEscape = function(string) {
    var workingString = '';
    if (string.indexOf('"') === -1) {
      workingString = string;
    } else {
      for (var i=0; i<string.length; i++) {
        var startingQuote = string.indexOf('"', i);
        if (startingQuote>-1) {
          workingString += string.substring(i, startingQuote);
          i = string.indexOf('"', startingQuote+1);
          workingString += string.substring(startingQuote+1, i).replace(",", '$(COMMA)')
        }
        if (i > string.length) { return workingString; }
      }
    }
    return workingString;
  }

  function cleanValue(value) {
    if (typeof value == 'string') {
      value = value.trim();
    }
    if(value == undefined || value == "null" || value === null) { return null;}
    if(value == "true" || value === true)  { return true; }
    if(value == "false" || value === false)  { return false; }
     debug.log(typeof value, value, "skipped the truth..");
    if(typeof value == 'object' || Array.isArray(value)) {console.log (value); return value  ;}
    if (value.includes("{") || value.includes("[")) {return parseJSON_debug(value);}
    if(value == '') return '';
    return value.trim().replace(/"/g,'').replaceAll("$(COMMA)", ",");
  }

  if (str[0] === '[') {
    ///this is an array!
    result = [];
    var arrayClose = str.indexOf(']');
    /*if (arrayClose === -1) {
       debug.log('error');
      throw new SyntaxError;
      return;
    } else */ if (arrayClose > 3) {
      var cleanStr = stringEscape(str.slice(1, arrayClose)).replace(/"/g, '');
      var elements = cleanStr.split(',');
      console.log(str, cleanStr, elements);
      for (var i = 0; i < elements.length; i++) {
        /*if (illegalChars.test(elements[i])) {
           debug.log('error');
          throw new SyntaxError;
        }*/
        result.push(cleanValue(elements[i]));
        if(/^-?[\d.]+(?:e-?\d+)?$/.test(result[i])) {
          result[i] = Number(result[i]);

        }
      }
    }
    // debug.log(json, JSON.parse(json), cleanValue(result));
  } if (str[0] === "{") {
    ///this is an object!
    result = {};
    //split with commas, except when within quotes
    var props = stringEscape(str.slice(1, -1)).split(",");
    for (var i=0; i<props.length; i++) {
      var keypair = props[i].replace(/"/g,'').replaceAll("$(COMMA)", ",").trim().split(":");
      if (props[i] !== '') {
        result[keypair[0]] = cleanValue(keypair[1]); //= parseJSON(keypair[1]);
      } else {

      }
    }
    // debug.log(json, JSON.parse(json), result);

  }
    /*if (objectClose - nextProperty > 5 ) {
      var key = str.slice(1, valueOffset - 1).replace(/"/g,"");
      var value = str.slice(valueOffset + 1, (nextProperty > 0) ? nextProperty - 1 : objectClose).trim().replace(/"/g,"");
      if (value == '""' || value == '\'\'' || value == '``') {
        value = '';
      }
      result[key] = parseJSON(value);

    }
  }*/
  return cleanValue(result);
};

var parseJSON = function(json) {

  if (JSON.stringify(JSON.parse(json)) === JSON.stringify(parseJSON_debug(json, false))) {
    console.log('function correct \ndata: ', json);
  } else {
    alert(json + ' NOT correct');
    console.log('\nexpected: ', JSON.parse(json), '\ngot: ', parseJSON_debug(json, true), '\n data: ', json);
  }
  return JSON.parse(json);

}
