/**
 * run-js - A prototyping server that just works.
 * JavaScript file handler. Transforms with `babelify`, using the `es2015` and `react` preset.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

module.exports = {
  extension: /\.jsx?$/, // .js & .jsx
  transforms: [
    {
      module: require('babelify'),
      opts: {
        presets: [ require('babel-preset-es2015'), require('babel-preset-react') ]
      }
    }
  ]
}
