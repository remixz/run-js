'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const path = require('path')
const levelup = require('levelup')
const md5 = require('md5-file')

let generateBundle = require('../generate-bundle')
let db = levelup('/run-js', { db: require('memdown') })

function bundleFileRoute (req, res, next) {
  let now = Date.now()
  let opts = req.app.locals.opts
  let instance = req.app.locals.instance
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
            instance.emit('bundle:error', {
              file: fileName,
              message: err.originalMessage
            })
          } else {
            let elapsed = Date.now() - now
            instance.emit('bundle', {
              file: fileName,
              size: script.length,
              bundleTime: elapsed,
              cached: false
            })
            db.put(dbPath, script)
          }

          res.set('Content-Type', 'application/javascript')
          res.send(script)
        })
      } else {
        let elapsed = Date.now() - now
        instance.emit('bundle', {
          file: fileName,
          size: script.length,
          bundleTime: elapsed,
          cached: true
        })

        res.set('Content-Type', 'application/javascript')
        res.send(script)
      }
    })
  })
}

module.exports = bundleFileRoute
