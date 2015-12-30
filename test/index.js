'use strict'
const fs = require('fs')
const path = require('path')
const tap = require('tap')
const async = require('async')

let RunJS = require('../lib')

fs.readdir(path.resolve(__dirname, './scenarios'), (err, tests) => {
  if (err) throw err

  async.eachSeries(tests, (testName, cb) => {
    let testDirectory = path.resolve(__dirname, './scenarios', testName)
    let testInput = path.join(testDirectory, 'input')
    tap.test(`scenario - ${testName}`, t => {
      let testInfo = require(testDirectory)
      let expected = ''
      if (!testInfo.noExpected) {
        expected = fs.readFileSync(path.join(testDirectory, 'expected/bundle.js')).toString()
      }

      let app = RunJS({
        dir: testInfo.dir || testInput,
        watch: testInfo.watch || false
      })

      let server = app.listen(9999, () => {
        testInfo.runner(testInfo, expected, t, (err) => {
          t.error(err, 'no errors from test runner')
          t.end()
          server.close(cb)
        })
      })
    })
  }, process.exit)
})
