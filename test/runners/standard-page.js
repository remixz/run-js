'use strict'
const fs = require('fs')
const path = require('path')
const request = require('request')
const async = require('async')
const template = require('lodash.template')

let pageTemplate = template(fs.readFileSync(path.join(__dirname, '../../lib/template/template.html')))

function standardPageRunner (testInfo, expected, t, cb) {
  let url = testInfo.url
  if (testInfo.bundleUrl) {
    url = testInfo.bundleUrl
  }
  let bundlePath = `/__bundle/${url.replace(/\//g, '-')}.bundle.js`

  async.series([
    function getPage (cb) {
      request({
        uri: `http://localhost:9999${testInfo.url}`,
        headers: {
          Accept: 'text/html'
        }
      }, (err, res, body) => {
        t.error(err, 'page request shouldn\'t fail')
        t.equals(res.statusCode, 200, 'page status code should be 200')

        let expectedPage = pageTemplate({
          reqPath: url,
          watch: false
        })

        t.equals(body, expectedPage, 'page output should be correct')
        cb()
      })
    },
    function getBundle (cb) {
      request(`http://localhost:9999${bundlePath}`, (err, res, body) => {
        t.error(err, 'bundle request shouldn\'t fail')
        t.equals(res.statusCode, 200, 'bundle status code should be 200')

        if (!testInfo.noSourceMap) {
          // test for sourcemap, then remove for script equality check, since sourcemap can differ between environments
          t.ok(body.indexOf('//# sourceMappingURL') > -1, 'inline sourcemap should exist')
          body = body.split('//# sourceMappingURL')[0]
          expected = expected.split('//# sourceMappingURL')[0]
        }

        if (testInfo.match) {
          t.match(body, testInfo.match, 'bundle output should be correct')
        } else {
          t.equals(body, expected, 'bundle output should be correct')
        }
        cb()
      })
    }
  ], cb)
}

module.exports = standardPageRunner
