var $_ = function(selector ,  parent = document){
  return  parent.querySelector(selector);
};

var $$_ = function(selector , parent = document){
  return  parent.querySelectorAll(selector);
};


var createElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.setAttribute('class', className);
  if (text) {
    element.textContent = text;
  }
  
  return element;
};