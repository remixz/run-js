module.exports = {
  url: '/foo',
  runner: require('../../runners/error-page')(404, 'The folder /foo doesn\'t have an index file. Try creating an index.js file in this folder.'),
  noExpected: true
}
