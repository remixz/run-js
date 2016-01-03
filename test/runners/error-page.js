'use strict'
const fs = require('fs')
const path = require('path')
const request = require('request')
const _ = require('lodash')

let pageTemplate = _.template(fs.readFileSync(path.join(__dirname, '../../lib/template/error.html')))

function errorPageRunner (status, message) {
  return function (testInfo, expected, t, cb) {
    request(`http://localhost:9999${testInfo.url}`, (err, res, body) => {
      t.error(err, 'request should complete')

      t.equals(res.statusCode, status, `should have expected ${status} error code`)

      let expectedPage = pageTemplate({
        status: status,
        message: message
      })

      t.equals(body, expectedPage, 'page output should be correct')

      cb()
    })
  }
}

module.exports = errorPageRunner
