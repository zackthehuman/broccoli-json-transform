var Filter = require('broccoli-filter');

module.exports = JsonTransform;
JsonTransform.prototype = Object.create(Filter.prototype);
JsonTransform.prototype.constructor = JsonTransform;

function JsonTransform (inputTree, options) {
  if (!(this instanceof JsonTransform)) {
    return new JsonTransform(inputTree, options);
  }

  options = options || {};

  Filter.call(this, inputTree, options);

  if (typeof options.transform !== 'function') {
    throw new Error('You must supply a `transform` function to broccoli-json-transform.');
  } else {
    this._transform = options.transform;
  }

  if (typeof options.space !== 'undefined') {
    this._space = options.space;
  } else {
    this._space = 2;
  }
}

JsonTransform.prototype.extensions = ['json'];
JsonTransform.prototype.targetExtension = 'json';

JsonTransform.prototype.processString = function (string) {
  var json = JSON.parse(string);
  return JSON.stringify(this._transform(json), null, this._space);
};
