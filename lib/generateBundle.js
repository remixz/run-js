'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const path = require('path')
const browserify = require('browserify')

function generateBundle (filePath, handler, cb) {
  let b = browserify(null, {
    debug: true
  })
  handler.transforms.forEach(transform => b.transform(transform.module, transform.opts))
  b.transform(require('installify'))

  b.add(filePath)
  b.bundle((err, buf) => {
    if (err) return cb(err)

    return cb(null, buf)
  })
}

module.exports = generateBundle
