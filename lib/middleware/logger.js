'use strict'
const log = require('bole')('run-js')

function loggerMiddleware (req, res, next) {
  if (req.url.indexOf('__bundle/') > -1) return next() // don't log __bundle requests
  if (req.url === 'favicon.ico' && res.statusCode === 404) return next() // don't log favicon.ico 404s

  let now = Date.now()
  function runLog () {
    log.info({
      elapsed: Date.now() - now,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode
    })
  }
  res.on('finish', runLog)

  next()
}

module.exports = loggerMiddleware
