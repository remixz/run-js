'use strict'
/**
 * run-js - A prototyping server that just works.
 *
 * @author Zach Bruggeman <mail@bruggie.com>
 */

const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

function htmlFileRoute (req, res, next) {
  let filePath = path.join(req.app.locals.opts.dir, req.path)

  if (path.extname(filePath) !== '.html') {
    // sent from the directory route, since it found an index.html
    filePath = filePath + '/index.html'
  }

  fs.readFile(filePath, (err, buf) => {
    if (err) return next(err)

    fs.readdir(path.dirname(filePath), (err, files) => {
      if (err) return next(err)

      let baseName = path.basename(filePath, '.html')
      let fileName = files.find(file => file.indexOf(baseName) === 0 && !file.includes('.html'))
      if (fileName) {
        let bundleName = path.normalize(`${path.dirname(req.path)}/${fileName}`).replace(/\//g, '-')
        let $ = cheerio.load(buf.toString())
        $('body').append(`<script src="/__bundle/${bundleName}.bundle.js"></script>`)
        if (req.app.locals.opts.watch) {
          $('body').append('<script src="//localhost:35729/livereload.js?snipver=1" async="" defer=""></script>')
        }
        res.send($.html())
      } else {
        res.send(buf.toString())
      }
    })
  })
}

module.exports = htmlFileRoute
