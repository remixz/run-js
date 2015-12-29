'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const fs = require('fs')
const path = require('path')
const template = require('lodash.template')

let pageTemplate = template(fs.readFileSync(path.join(__dirname, '../template/template.html')))

function scriptFileRoute (req, res, next) {
  if (req.query.raw === '') return next()

  let filePath = path.join(req.app.locals.dir, req.path)
  fs.stat(filePath, err => {
    if (err) return next(err)

    if (!req.headers.accept.includes('text/html')) return next()

    let compiled = pageTemplate({
      reqPath: req.path
    })
    res.send(compiled)
  })
}

module.exports = scriptFileRoute
