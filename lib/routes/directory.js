'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const fs = require('fs')
const path = require('path')
const template = require('lodash.template')

let htmlFileRoute = require('./html-file')
let pageTemplate = template(fs.readFileSync(path.join(__dirname, '../template/template.html')))
let fileHandlers = require('../handlers')

function directoryRoute (req, res, next) {
  let filePath = path.join(req.app.locals.dir, req.path)

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

      let handler = fileHandlers.find(h => h.extension.test(indexFile))
      if (!handler) return next()

      let compiled = pageTemplate({
        reqPath: path.normalize(`${req.path}/${indexFile}`),
        watch: req.app.locals.watch
      })
      res.send(compiled)
    })
  })
}

module.exports = directoryRoute
