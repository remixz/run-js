'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const express = require('express')
const Gaze = require('gaze').Gaze
const tinylr = require('tiny-lr')

let fileHandlers = require('./handlers')

let bundleFileRoute = require('./routes/bundle-file')
let scriptFileRoute = require('./routes/script-file')
let htmlFileRoute = require('./routes/html-file')
let directoryRoute = require('./routes/directory')
let defaultIndexRoute = require('./routes/default-index')
let errorHandler = require('./routes/error-handler')

function createApp (opts) {
  if (!opts) opts = {}

  let app = express()

  app.locals.dir = opts.dir || process.cwd()
  if (opts.watch === undefined) opts.watch = true
  app.locals.watch = opts.watch

  if (app.locals.watch) {
    let gaze = new Gaze(['**/*', '!node_modules/**'], { cwd: app.locals.dir })

    let lr = tinylr({port: 35729})
    lr.listen()

    gaze.on('ready', () => console.log('Live reloading enabled.'))
    gaze.on('all', (event, fp) => {
      lr.notifyClients([fp])
    })
    gaze.on('error', err => {
      console.error(err)
    })
  }

  app.get('/__bundle/:file.bundle.js', bundleFileRoute)

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
