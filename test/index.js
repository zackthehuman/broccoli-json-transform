var JsonTransform   = require('../index');
var chai            = require('chai');
var chaiAsPromised  = require('chai-as-promised');
var fs              = require('fs');
var path            = require('path');
var testHelpers     = require('broccoli-test-helpers');
var makeTestHelper  = testHelpers.makeTestHelper;
var cleanupBuilders = testHelpers.cleanupBuilders;
var expect          = chai.expect;

chai.use(chaiAsPromised);

var FIXTURES     = path.join(__dirname, 'fixtures');
var EXPECTATIONS = path.join(__dirname, 'expectations');

function identity(obj) {
  return obj;
}

function capitalizeKeys(obj) {
  var result = {};
  var keys = Object.keys(obj);

  for(var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    result[key.toUpperCase()] = obj[key];
  }

  return result;
}

describe('JsonTransform', function() {
  var TestJsonTransform = makeTestHelper({
    subject: JsonTransform,
    fixturePath: FIXTURES
  });

  afterEach(function() {
    return cleanupBuilders();
  });

  it('should throw if no transform is specified', function() {
    function fn() {
      return new JsonTransform('.', {});
    }

    expect(fn).to.throw(/You must supply a `transform` function to broccoli-json-transform\./);
  });

  it('should throw if the transform is not a function', function() {
    function fn() {
      return new JsonTransform('.', { transform: 'foo' });
    }

    expect(fn).to.throw(/You must supply a `transform` function to broccoli-json-transform\./);
  });

  it('should apply the transform to each input file', function() {
    return TestJsonTransform('test-case-1', {
      transform: capitalizeKeys
    }).then(function(result) {
      expect(result.files).to.deep.equal([
        'a.json',
        'b.json'
      ]);

      result.files.forEach(function(file) {
        var output = fs.readFileSync(path.join(result.directory, file), 'utf8');
        var expectation = fs.readFileSync(path.join(EXPECTATIONS, 'test-case-1', file), 'utf8');
        expect(output).to.equal(expectation);
      });
    });
  });

  it('should use the amount of spacing supplied (if supplied)', function() {
    return TestJsonTransform('test-case-2', {
      transform: identity,
      space: 4
    }).then(function(result) {
      result.files.forEach(function(file) {
        var output = fs.readFileSync(path.join(result.directory, file), 'utf8');
        var expectation = fs.readFileSync(path.join(EXPECTATIONS, 'test-case-2', file), 'utf8');
        expect(output).to.equal(expectation);
      });
    });
  });
});
