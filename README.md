# compile-code-loader
Compiles javascript with webpack and loads result as string

#Usage: 

To compile and get result as string:
```js
var compiledSourceString = require('compile-code?asString=true!./fileToLoad');
```


Also it is possible to get result as javascript and apply transformation, uglifyjs for example:
```js
var compiledSourceString = require('raw!uglify!compile-code!./fileToLoad');
```

### Contributing

1. `npm install`
2. `cd examples && npm install`
3. `npm run build-examples`