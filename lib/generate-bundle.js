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
const _ = require('lodash')

const errorTemplate = _.template(fs.readFileSync(path.resolve(__dirname, './template/bundle-error.html')))

function generateErrorScript (err) {
  let errorBox = errorTemplate({
    name: err.name,
    message: ansiUp.ansi_to_html(escapeHtml(err.message))
  })

  // if it's not a string, and just included as a function that's interpolated by the returned string
  // it'll get mucked up during coverage testing
  let bundleJs = `function bundleError () {
    var template = ${JSON.stringify(errorBox)}
    if (typeof document === 'undefined') return
    document.addEventListener('DOMContentLoaded', function print () {
      var container = document.createElement('div')
      container.innerHTML = template
      document.body.appendChild(container)
    })
  }`

  return `;(${bundleJs})()\n`
}

function generateBundle (opts, cb) {
  let b = browserify({
    debug: true
  })
  if (opts.handler.plugins) {
    opts.handler.plugins.forEach(plugin => b.plugin(plugin.module, plugin.opts))
  }
  if (opts.handler.transforms) {
    opts.handler.transforms.forEach(transform => b.transform(transform.module, transform.opts))
  }

  if (opts.plugins) {
    opts.plugins.forEach(plugin => b.plugin(plugin.module, plugin.opts))
  }
  if (opts.transforms) {
    opts.transforms.forEach(transform => b.transform(transform.module, transform.opts))
  }
  b.add(opts.file)

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
    err.message = opts.handler.errorMessage && opts.handler.errorMessage(err) || err.message
    let errorScript = generateErrorScript(err)

    cb(true, errorScript)
  })

  bd.pipe(bdStream)
}

module.exports = generateBundle
