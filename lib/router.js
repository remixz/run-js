'use strict'
const express = require('express')

let bundleFileRoute = require('./routes/bundle-file')
let scriptFileRoute = require('./routes/script-file')
let htmlFileRoute = require('./routes/html-file')
let directoryRoute = require('./routes/directory')
let defaultIndexRoute = require('./routes/default-index')

function createRouter (handlers) {
  let router = express.Router()

  router.get('/__bundle/:file.bundle.js', bundleFileRoute)

  handlers.forEach(handler => {
    router.get(handler.extension, scriptFileRoute)
  })

  router.get('**/*.html', htmlFileRoute)

  router.get('*', directoryRoute)

  router.get('/', defaultIndexRoute)

  return router
}

module.exports = createRouter
