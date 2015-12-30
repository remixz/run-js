'use strict'
const fs = require('fs')
const path = require('path')
const request = require('request')

let defaultIndex = fs.readFileSync(path.join(__dirname, '../../lib/template/index.html')).toString()

function defaultIndexPageRunner (testInfo, expected, t, cb) {
  request(`http://localhost:9999`, (err, res, body) => {
    t.error(err, 'request should complete')
    t.equals(res.statusCode, 200, `page status code should be 200`)
    t.equals(body, defaultIndex, 'page output should be correct')

    cb()
  })
}

module.exports = defaultIndexPageRunner
