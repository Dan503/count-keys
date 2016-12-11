# count-keys

A JS function for counting the number of keys there are in objects and arrays, including nested objects and arrays.

```````
npm install count-keys --save
```````

the first parameter in `countKeys` is the object you wish to count the number of items in. The second parameter takes

``````js
countKeys(object, options)
``````

## Default functionality

By default, every key in the object will increase the increment of the return value by 1. If a value in the object is another object, it will also count all the keys in that child object. Since arrays are essentially objects with numbered keys (`['a', 'b','c']` being similar to `{0:'a', 1:'b', 2:'c'}`) this will also count array items by default.

```````js
var countKeys = require('count-keys');

var object = {
  one: {
    two : 'string',
    three : {
      four: ['five', 'six']
    }
  },
  seven: 'string',
  eight: {
    nine : 'string',
  }
}

var keyCount = countKeys(object);

// keyCount = 9
```````

## Excluding arrays

Arrays and objects aren't exactly the same thing though so it's understandable that you might not want to include array items in the index count. To turn off array counting, use the `arrays` setting.

```````js
var countKeys = require('count-keys');

var object = {
  one: {
    two : 'string',
    three : {
      four: ['string', 'string']
    }
  },
  five: 'string',
  six: {
    seven : 'string',
  }
}

var keyCount = countKeys(object, { arrays: false })

// keyCount = 7
```````

## Excluding sub-objects

Maybe you don't want to know how deep the rabit hole goes. Maybe you just want to count the blades of grass at the entrance. For a simple top level only counting of the number of keys there are in an object, set `recursive` to `false`.

```````js
var countKeys = require('count-keys');

var object = {
  one: {
    keyA : 'string',
    keyB : {
      keyC: ['string', 'string']
    }
  },
  two: 'string',
  three: {
    keyD : 'string',
  }
}

var keyCount = countKeys(object, { recursive: false })

// keyCount = 3
```````

## Custom filtering

If you aren't happy with the results you are getting back from the function, you might need to do custom filtering.

```````js
var countKeys = require('count-keys');

var object = {
  one: {
    a : 'string',
    two : {
      three: ['four', 'five']
    }
  },
  b: 'string',
  six: {
    c : 'string',
  }
}

var keyCount = countKeys(object, { filter: function(item){
    // available values in "item":
    // item.key, item.value, item.count, item.parent

    if (item.value === 'string') return false;
}})

// keyCount = 6
```````

These are the values you have available to you in the "item" variable:

- **key:** The key for the current key/value pair
- **value:** The value for the current key/value pair
- **count:** The count as it is so far
- **parent:** The object containing the current key/value pair


