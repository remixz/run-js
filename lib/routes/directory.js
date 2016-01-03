'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const fs = require('fs')
const path = require('path')
const _ = require('lodash')

let htmlFileRoute = require('./html-file')
let pageTemplate = _.template(fs.readFileSync(path.join(__dirname, '../template/template.html')))

function directoryRoute (req, res, next) {
  let filePath = path.join(req.app.locals.opts.dir, req.path)

  fs.stat(filePath, (err, stat) => {
    if (err) return next(err)
    if (!stat.isDirectory()) return next()

    fs.readdir(filePath, (err, files) => {
      if (err) return next(err)

      let indexFile = files.find(file => file.indexOf('index') === 0)
      if (!indexFile && req.path === '/') return next() // we'll show the default page
      if (!indexFile) {
        let err = new Error()
        err.code = 'ENOINDEX'
        return next(err)
      }

      if (indexFile === 'index.html') {
        return htmlFileRoute(req, res, next)
      }

      let handlers = req.app.locals.opts.handlers
      let handler = handlers.find(h => h.extension.test(indexFile))
      if (!handler) return next()

      let compiled = pageTemplate({
        reqPath: path.normalize(`${req.path}/${indexFile}`),
        watch: req.app.locals.opts.watch
      })
      res.send(compiled)
    })
  })
}

module.exports = directoryRoute
