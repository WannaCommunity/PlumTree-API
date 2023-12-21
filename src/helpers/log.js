'use strict'

const bunyan = require('bunyan')
const log = (function () {
  return bunyan.createLogger({
    name: 'plum-tree-api',
    serializers: bunyan.stdSerializers // workaround for https://github.com/trentm/node-bunyan/issues/369
  })
}())

if (process.env.NODE_ENV === 'test') {
  log.level(bunyan.FATAL + 1)
}

module.exports = log
