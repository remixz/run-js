/**
 * run-js - A prototyping server that just works.
 * Array of the default global transforms.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

module.exports = [
  {
    module: require('installify')
  },
  {
    module: require('brfs')
  }
]
