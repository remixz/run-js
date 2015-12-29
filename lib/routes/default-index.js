'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const path = require('path')

function defaultIndexRoute (req, res, next) {
  return res.sendFile(path.resolve(__dirname, '../template/index.html'))
}

module.exports = defaultIndexRoute
