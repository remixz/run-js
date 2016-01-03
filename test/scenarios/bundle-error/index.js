module.exports = {
  url: '/foo.js',
  runner: require('../../runners/standard-page'),
  noSourceMap: true,
  match: 'function bundleError ()'
}
