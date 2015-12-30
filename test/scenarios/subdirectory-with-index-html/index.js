const fs = require('fs')
const path = require('path')

module.exports = {
  url: '/foo',
  runner: require('../../runners/html-file-page'),
  expectedHtml: fs.readFileSync(path.join(__dirname, 'expected', 'page.html')).toString(),
  noExpected: true
}
