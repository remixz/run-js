'use strict'
const fs = require('fs')
const tap = require('tap')
const request = require('request')
const async = require('async')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')

let RunJS = require('../lib')

const appOpts = {
  dir: __dirname,
  watch: true,
  port: 9999
}

async.series([
  cb => {
    tap.test('watch – server starts', t => {
      let app = new RunJS(appOpts)

      app.start(err => {
        t.error(err, 'server started up successfully')

        request({
          uri: 'http://localhost:35729',
          json: true
        }, (err, res, body) => {
          t.error(err, 'request should complete')
          t.equals(res.statusCode, 200, 'request should have status code 200')

          t.equals(body.tinylr, 'Welcome', 'request body property `tinylr` should have expected response')
          t.end()
          app.stop(cb)
        })
      })
    })
  },

  cb => {
    tap.test('watch – modifying files', t => {
      let app = new RunJS(appOpts)
      mkdirp.sync(__dirname + '/_test')

      app.start(err => {
        t.error(err, 'server started up successfully')

        app.on('watch:ready', () => {
          fs.writeFileSync(__dirname + '/_test/file.js')
        })

        app.on('watch:all', (event, fp) => {
          t.equals(event, 'add', 'watch event should be correct')
          t.equals(fp, __dirname + '/_test/file.js', 'watch file path should be correct')
          app.stop(() => {
            rimraf(__dirname + '/_test', cb)
          })
          t.end()
        })

        app.on('watch:error', err => {
          t.bailout(err)
        })
      })
    })
  }
])
