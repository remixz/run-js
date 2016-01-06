# run-js api

## initializing
```js
const RunJS = require('run-js')

let app = new RunJS({
  dir: process.cwd(), // directory to serve files from. defaults to current working directory
  watch: true, // enables/disables watch server for livereload. defaults to true.
  port: 60274, // port to listen on. defaults to 60274
  handlers: [], // array of file handler objects to use. none added by default. see below for format.
  transforms: [], // array of browserify transforms to use. none added by default. see below for format.
  plugins: [] // array of browserify plugins to use. none added by default. see below for format.
})
```

## handlers, transforms & plugins

* **handler** - run on files that match its `extension` property. should have 1 or more browserify transforms.

```js
{
  extension: /\.jsx?$/, // regex for file extension to match
  transforms: [ // array of transforms to run on file. run from first to last.
    {
      module: require('babelify'), // should be a browserify transform
      opts: { // options to pass to the transform
        presets: [ require('babel-preset-es2015'), require('babel-preset-react') ]
      }
    }
  ],
  errorMessage: function (err) { // the message to display in the browser if there was a compilation error
    return `${err.message}\n\n${err.codeFrame}`
  }
}
```
* **transform** - a browserify transform run on the file after the handler transforms it into JS.

```js
{
  module: require('installify'), // should be a browserify transform
  opts: {} // options to pass to the transform
}
```

* **plugin** - a browserify plugin run on the file after the handler transforms it into JS.

```js
{
  module: require('browserify-hmr'), // should be a browserify plugin
  opts: {} // options to pass to the plugin
}
```

the `run-js` api doesn't add any file handlers, transforms, or plugins by default. this is to make it as extensible as possible. to make it easier to develop with, however, a set of default handlers and transforms are provided with the module (and plugins in the future, if the module ends up using them by default). these are available with `require('run-js/lib/default-handlers')` and `require('run-js/lib/default-transforms')`, respectively. those can be passed to the `handlers` and `transforms` options in your `new RunJS` call.

## methods

### app.start(function (err) {})

starts the app. runs the passed callback when finished initializing.

### app.stop(function (err) {})

stops the app. runs the passed callback when finished stopping.

## events

### app.on('request', function (req, res, timestamp) {})

fired when a page is loaded. includes the request object, the response object, and a timestamp of when the request initiated. the timestamp can be used to determine how long it took to serve the response.

### app.on('bundle', function (info) {})

fired when a script bundle is finished generating. includes an info object, with this format:

```js
{
  file: '/path/to/file', // absolute path to file that the bundle was generated for
  size: 31415, // size in bytes of the bundle
  bundleTime: 1337, // time in milliseconds of how long it took the bundle to generate
  cached: false // whether or not the bundle was returned from the internal cache
}
```

### app.on('bundle:error', function (err) {})

fired when the bundle errors. includes the error from the bundle generator.

### app.on('watch:ready', function () {})

fired when the watch server is ready.

### app.on('watch:all', function (event, filepath) {})

fired when there's a watch event. `event` may be [any of the events fired by chokidar.](https://github.com/paulmillr/chokidar#methods--events)

### app.on('watch:error', function (err) {})

fired when the watch server has an error. includes the error from `chokidar`.
