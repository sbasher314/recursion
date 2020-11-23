// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
  var proper =  Array.prototype.slice.apply(document.getElementsByClassName(className));
  var elements = [];
  var getChildrenAsArray = function(element, className) {
    element.classList = element.classList || [];
    var classList = Array.prototype.slice.apply(element.classList);
    var matches = (classList.includes(className)) ? [element] : []; // If current element has className, create new array with current elements as first index;
    if (element.hasChildNodes() === true) {
      for (var i = 0; i < element.childNodes.length; i++) {
        var children = getChildrenAsArray(element.childNodes[i], className);
        matches = matches.concat(children); // Recursively append (matching) children to the current list
      }
    }
    return matches;
  }
  elements = getChildrenAsArray(document.body, className); // Gets all children and returns for those equaling className -- including first element passed.
  return elements;
};
