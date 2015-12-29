/**
 * run-js - A prototyping server that just works.
 * TypeScript file handler. Transforms using the `tsify` transformer.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

module.exports = {
  extension: /\.ts$/,
  transforms: [
    {
      module: require('tsify')
    }
  ]
}
