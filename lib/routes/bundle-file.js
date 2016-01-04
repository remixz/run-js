'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const path = require('path')
const levelup = require('levelup')
const md5 = require('md5-file')
const log = require('bole')('run-js')
const prettyBytes = require('pretty-bytes')

let generateBundle = require('../generate-bundle')
let db = levelup('/run-js', { db: require('memdown') })

function bundleFileRoute (req, res, next) {
  let now = Date.now()
  let opts = req.app.locals.opts
  let fileName = req.params.file.replace(/-/g, '/')
  let filePath = path.join(opts.dir, fileName)

  md5(filePath, (err, hash) => {
    if (err) return next(err)

    let dbPath = `${filePath}.${hash}`

    db.get(dbPath, (err, script) => {
      if (err || !script) {
        let fileBase = path.basename(filePath)
        let handler = opts.handlers.find(h => h.extension.test(fileBase))
        let bundleOpts = {
          file: filePath,
          handler: handler,
          transforms: opts.transforms,
          plugin: opts.plugins
        }

        generateBundle(bundleOpts, (err, script) => {
          if (err) {
            log.error({
              message: err.originalMessage,
              fileName: fileName,
              type: 'bundle'
            })
          } else {
            let elapsed = Date.now() - now
            log.info({
              message: `Generated bundle for ${fileName} (${prettyBytes(script.length)}) in ${elapsed}ms`,
              fileName: fileName,
              size: script.length,
              bundleTime: elapsed,
              type: 'bundle'
            })
            db.put(dbPath, script)
          }

          res.set('Content-Type', 'application/javascript')
          res.send(script)
        })
      } else {
        let elapsed = Date.now() - now
        log.info({
          message: `Returned cached bundle for ${fileName} (${prettyBytes(script.length)}) in ${elapsed}ms`,
          fileName: fileName,
          size: script.length,
          bundleTime: elapsed,
          type: 'bundle'
        })
        res.set('Content-Type', 'application/javascript')
        res.send(script)
      }
    })
  })
}

module.exports = bundleFileRoute
