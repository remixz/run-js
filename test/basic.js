'use strict'
const tap = require('tap')

let RunJS = require('../lib')

const appOpts = {
  port: 9999,
  watch: false
}

tap.test('basic test – initialization', t => {
  let app = new RunJS(appOpts)

  t.type(app.start, 'function', 'app.start is a function')
  t.type(app.stop, 'function', 'app.stop is a function')
  t.type(app.opts, 'object', 'app.opts is an object')
  t.end()
})

tap.test('basic test – stopping server before starting', t => {
  let app = new RunJS(appOpts)

  app.stop(err => {
    t.type(err, Error, 'app instance should return error server is stopped when it\'s not running')
    t.end()
  })
})
