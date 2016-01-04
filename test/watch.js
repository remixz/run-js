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

      app.start(err => {
        t.error(err, 'server started up successfully')

        mkdirp.sync(__dirname + '/_test')
        fs.writeFileSync(__dirname + '/_test/file.js')
        request({
          uri: 'http://localhost:35729/changed?files=watch_test.js',
          json: true
        }, (err, res, body) => {
          t.error(err, 'request should complete')
          t.equals(res.statusCode, 200, 'request should have status code 200')

          t.strictSame(body, { clients: [], files: ['watch_test.js'] }, 'should have expected response')
          t.end()
          app.stop()
          rimraf(__dirname + '/_test', cb)
        })
      })
    })
  }
])
