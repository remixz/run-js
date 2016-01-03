/**
 * run-js - A prototyping server that just works.
 * Array of the default file handlers.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

module.exports = [
  require('./handlers/javascript'),
  require('./handlers/coffeescript'),
  require('./handlers/typescript')
]
