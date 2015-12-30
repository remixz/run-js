module.exports = {
  url: '/404',
  runner: require('../../runners/error-page')(404, 'The folder /404 was not found. Maybe you didn\'t create it yet?'),
  noExpected: true
}
