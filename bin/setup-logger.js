const log = require('bole')('run-js')
const prettyBytes = require('pretty-bytes')

function setupLogger (app) {
  app.on('request', (req, res, start) => {
    if (req.url.indexOf('__bundle/') > -1) return // don't log __bundle requests
    if (req.url === 'favicon.ico' && res.statusCode === 404) return // don't log favicon.ico 404s

    log.info({
      elapsed: Date.now() - start,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode
    })
  })

  app.on('bundle', info => {
    info.message = (info.cached ? 'Returned cached bundle for ' : 'Generated bundle for ') + `${info.file} (${prettyBytes(info.size)}) in ${info.bundleTime}ms`
    info.type = 'bundle'
    log.info(info)
  })

  app.on('bundle:error', info => {
    info.type = 'bundle'
    log.error(info)
  })

  app.once('watch:ready', () => {
    log.info({
      message: 'Live reloading enabled.',
      type: 'watch'
    })
  })

  app.on('watch:all', (event, fp) => {
    log.info({
      message: `File ${event}: ${fp}`,
      type: 'watch'
    })
  })

  app.on('watch:error', err => {
    log.error(err)
  })

  return app
}

module.exports = setupLogger
