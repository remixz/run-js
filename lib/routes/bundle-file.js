'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const path = require('path')
const levelup = require('levelup')
const md5 = require('md5-file')

let generateBundle = require('../generateBundle')
let fileHandlers = require('../handlers')

let db = levelup('/run-js', { db: require('memdown') })
function bundleFileRoute (req, res, next) {
  let fileName = req.params.file.replace(/-/g, '/')
  let filePath = path.join(process.cwd(), fileName)
  md5(filePath, (err, hash) => {
    let dbPath = `${filePath}.${hash}`

    db.get(dbPath, (err, script) => {
        if (err || !script) {
          let fileBase = path.basename(filePath)
          let handler = fileHandlers.find(h => h.extension.test(fileBase))
          generateBundle(filePath, handler, (err, script) => {
            if (err) return next(err)

            db.put(dbPath, script)
            res.set('Content-Type', 'application/javascript')
            res.send(script)
          })
        } else {
          res.set('Content-Type', 'application/javascript')
          res.send(script)
        }
    })
  })
}

module.exports = bundleFileRoute
