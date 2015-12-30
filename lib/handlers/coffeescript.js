/**
 * run-js - A prototyping server that just works.
 * CoffeeScript file handler. Transforms using the `coffeeify` transformer.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

module.exports = {
  extension: /\.coffee$/,
  transforms: [
    {
      module: require('coffeeify')
    }
  ],
  errorMessage: function (err) {
    return err.annotated
  }
}
