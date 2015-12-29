/**
 * run-js - A prototyping server that just works.
 * Object of all available file handlers.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

module.exports = [
  require('./javascript'),
  require('./coffeescript'),
  require('./typescript')
]
