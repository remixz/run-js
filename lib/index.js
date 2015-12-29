'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const express = require('express')

let fileHandlers = require('./handlers')

let bundleFileRoute = require('./routes/bundle-file')
let scriptFileRoute = require('./routes/script-file')
let htmlFileRoute = require('./routes/html-file')
let directoryRoute = require('./routes/directory')
let defaultIndexRoute = require('./routes/default-index')
let errorHandler = require('./routes/error-handler')

function createApp (opts) {
  if (!opts) opts = {}

  // Adds your own handlers to the current handlers
  // @TODO - expose this in a better way for the CLI
  //         maybe there could be presets, a la Babel?
  if (opts.handlers) {
    fileHandlers.concat(opts.handlers)
  }

  let app = express()

  app.get('/__bundle/:file.bundle.js', bundleFileRoute)

  fileHandlers.forEach(handler => {
    app.get(handler.extension, scriptFileRoute)
  })

  app.get('**/*.html', htmlFileRoute)

  app.get('*', directoryRoute)

  app.get('/', defaultIndexRoute)

  app.use(express.static(process.cwd()))

  // stop favicon errors in console
  app.get('/favicon.ico', (req, res) => {
    return res.status(200).end()
  })

  app.use(errorHandler)

  return app
}

module.exports = createApp
