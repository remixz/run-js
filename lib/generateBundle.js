'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const fs = require('fs')
const path = require('path')
const browserify = require('browserify')
const concat = require('concat-stream')
const ansiUp = require('ansi_up')
const escapeHtml = require('escape-html')
const template = require('lodash.template')

const errorTemplate = template(fs.readFileSync(path.resolve(__dirname, './template/bundle-error.html')))

function generateErrorScript (err) {
  let errorBox = errorTemplate({
    name: err.name,
    message: ansiUp.ansi_to_html(escapeHtml(err.message))
  })

  // if it's not a string, and just included as a function that's interpolated by the returned string
  // it'll get mucked up during coverage testing
  let bundleJs = `function bundleError (template) {
    if (typeof document === 'undefined') {
      return
    } else if (!document.body) {
      document.addEventListener('DOMContentLoaded', print)
    } else {
      print()
    }
    function print () {
      var container = document.createElement('div')
      container.innerHTML = template
      document.body.appendChild(container)
    }
  }`

  return `;(${bundleJs})(${JSON.stringify(errorBox)})\n`
}

function generateBundle (filePath, handler, cb) {
  let b = browserify(filePath, {
    debug: true
  })
  if (handler.plugins) {
    handler.plugins.forEach(plugin => b.plugin(plugin.module, plugin.opts))
  }
  if (handler.transforms) {
    handler.transforms.forEach(transform => b.transform(transform.module, transform.opts))
  }
  b.transform(require('installify'))

  let bd = b.bundle()
  let didError = false

  let bdStream = concat(body => {
    if (didError) return

    cb(null, body)
  })

  // i'd do .once here, but tsify emits multiple errors, because... well, because it can, i guess.
  bd.on('error', err => {
    if (didError) return
    didError = true
    err.message = handler.errorMessage && handler.errorMessage(err) || err.message
    let errorScript = generateErrorScript(err)

    cb(true, errorScript)
  })

  bd.pipe(bdStream)
}

module.exports = generateBundle
