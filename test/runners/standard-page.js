'use strict'
const request = require('request')
const async = require('async')

function standardPageRunner (testInfo, expected, t, cb) {
  let bundlePath = `/__bundle/${testInfo.url.replace(/\//g, '-')}.bundle.js`

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

        t.equals(body, expected.page, 'page output should be correct')
        cb()
      })
    },
    function getBundle (cb) {
      request(`http://localhost:9999${bundlePath}`, (err, res, body) => {
        t.error(err, 'bundle request shouldn\'t fail')
        t.equals(res.statusCode, 200, 'bundle status code should be 200')

        // test for sourcemap, then remove for script equality check, since sourcemap can differ between environments
        t.ok(body.indexOf('//# sourceMappingURL') > -1, 'inline sourcemap should exist')
        body = body.split('//# sourceMappingURL')[0]

        t.equals(body, expected.bundle, 'bundle output should be correct')
        cb()
      })
    }
  ], cb)
}

module.exports = standardPageRunner
