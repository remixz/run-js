/**
 * run-js - A prototyping server that just works.
 * TypeScript file handler. Transforms using the `tsify` transformer.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

module.exports = {
  extension: /\.ts$/,
  plugins: [
    {
      module: require('tsify')
    }
  ],
  errorMessage: function (err) {
    return err.message
  }
}
