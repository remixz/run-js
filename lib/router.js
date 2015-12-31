'use strict'
const express = require('express')

let fileHandlers = require('./handlers')
let bundleFileRoute = require('./routes/bundle-file')
let scriptFileRoute = require('./routes/script-file')
let htmlFileRoute = require('./routes/html-file')
let directoryRoute = require('./routes/directory')
let defaultIndexRoute = require('./routes/default-index')

function createRouter () {
  let router = express.Router()

  router.get('/__bundle/:file.bundle.js', bundleFileRoute)

  fileHandlers.forEach(handler => {
    router.get(handler.extension, scriptFileRoute)
  })

  router.get('**/*.html', htmlFileRoute)

  router.get('*', directoryRoute)

  router.get('/', defaultIndexRoute)

  // stop favicon errors in console
  router.get('/favicon.ico', (req, res) => {
    return res.status(200).end()
  })

  return router
}

module.exports = createRouter
