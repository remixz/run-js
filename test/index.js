'use strict'
const fs = require('fs')
const path = require('path')
const tap = require('tap')

let RunJS = require('../lib')

fs.readdir(path.resolve(__dirname, './scenarios'), (err, tests) => {
  if (err) throw err

  tests.forEach(testName => {
    let testDirectory = path.resolve(__dirname, './scenarios', testName)
    let testInput = path.join(testDirectory, 'input')
    tap.test(`scenario - ${testName}`, t => {
      let app = RunJS({
        dir: testInput,
        watch: false
      })
      let testInfo = require(testDirectory)
      let expected = {
        bundle: fs.readFileSync(path.join(testDirectory, 'expected/bundle.js')).toString().split('//# sourceMappingURL')[0],
        page: fs.readFileSync(path.join(testDirectory, 'expected/page.html')).toString()
      }

      let server = app.listen(9999, () => {
        testInfo.runner(testInfo, expected, t, (err) => {
          t.error(err)
          t.done()
          server.close()
        })
      })
    })
  })
})
