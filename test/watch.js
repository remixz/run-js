'use strict'
const tap = require('tap')
const request = require('request')

let RunJS = require('../lib')

tap.test('watch server', t => {
  let app = new RunJS({
    dir: __dirname,
    watch: true,
    port: 9999
  })

  app.start(() => {
    request({
      uri: 'http://localhost:35729',
      json: true
    }, (err, res, body) => {
      t.error(err, 'request should complete')
      t.equals(res.statusCode, 200, 'request should have status code 200')

      t.equals(body.tinylr, 'Welcome', 'request body property `tinylr` should have expected response')
      t.end()
      app.stop()
    })
  })
})
