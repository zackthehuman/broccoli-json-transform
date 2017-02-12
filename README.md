# broccoli-json-transform
Broccoli plugin that allows for JSON files to be modified by using a transform.

## Installation

```bash
npm install --save-dev broccoli-json-transform
```

## Usage

```js
var JsonTransform = require('broccoli-json-transform');

var tranformedJson = new JsonTransform(inputNode, options);
```

* **`inputNode`**: A broccoli node

* **`options`**: A hash of options

### Options

* `transform`: The function used to transform the JSON content. Should return
               an object.

* `space`: Optional. String or number. Used when stringifying the JSON.

### Example

If this is your `example.json`:

```js
{
  "foo": "bar"
}
```

And this is your build pipeline:

```js
var JsonTransform = require('broccoli-json-transform');

function capitalizeKeys(obj) {
  var result = {};
  var keys = Object.keys(obj);

  for(var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    result[key.toUpperCase()] = obj[key];
  }

  return result;
}

var tranformedJson = new JsonTransform(inputNode, { transform: capitalizeKeys });
```

Then the output `example.json` will look like this:

```js
{
  "FOO": "bar"
}
```

## Contributing

Clone this repo and run the tests like so:

```
npm install
npm test
```