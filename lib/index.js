'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const express = require('express')
const Gaze = require('gaze').Gaze
const tinylr = require('tiny-lr')
const path = require('path')
const process = require('process')

let fileHandlers = require('./handlers')

let bundleFileRoute = require('./routes/bundle-file')
let scriptFileRoute = require('./routes/script-file')
let htmlFileRoute = require('./routes/html-file')
let directoryRoute = require('./routes/directory')
let defaultIndexRoute = require('./routes/default-index')
let errorHandler = require('./routes/error-handler')

function createApp (opts) {
  var gaze = new Gaze(path.join(process.cwd(), '**', '*'))

  var lr = require('tiny-lr')({port: 35729})
  lr.listen()

  gaze.on('ready', () => console.log('watching!'))
  gaze.on('all', (event, fp) => lr.notifyClients([fp]))

  if (!opts) opts = {}

  // Adds your own handlers to the current handlers
  // @TODO - expose this in a better way for the CLI
  //         maybe there could be presets, a la Babel?
  if (opts.handlers) {
    fileHandlers.concat(opts.handlers)
  }

  let app = express()

  app.locals.dir = opts.dir || process.cwd()

  app.get('/__bundle/:file.bundle.js', bundleFileRoute)

  // Inject livereload snippet
  app.use(require('connect-livereload')())

  fileHandlers.forEach(handler => {
    app.get(handler.extension, scriptFileRoute)
  })

  app.get('**/*.html', htmlFileRoute)

  app.get('*', directoryRoute)

  app.get('/', defaultIndexRoute)

  app.use(express.static(app.locals.dir))

  // stop favicon errors in console
  app.get('/favicon.ico', (req, res) => {
    return res.status(200).end()
  })

  app.use(errorHandler)

  return app
}

module.exports = createApp
