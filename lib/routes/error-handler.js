'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const fs = require('fs')
const path = require('path')
const template = require('lodash.template')

let pageTemplate = template(fs.readFileSync(path.join(__dirname, '../template/error.html')))

function errorHandler (err, req, res, next) {
  let status = 500
  let message = err.message

  if (err.code === 'ENOENT') {
    let pathType = (path.extname(err.path) !== '' ? 'file' : 'folder')
    status = 404
    message = `The ${pathType} ${req.path} was not found. Maybe you didn't create it yet?`
  }

  if (err.code === 'ENOINDEX') {
    status = 404
    message = `The folder ${req.path} doesn't have an index file. Try creating an index.js file in this folder.`
  }

  let template = pageTemplate({
    status: status,
    message: message
  })

  return res.status(status).send(template)
}

module.exports = errorHandler
