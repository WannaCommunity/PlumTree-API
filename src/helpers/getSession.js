const get = require('lodash.get')
const jwt = require('jsonwebtoken')
const log = require('./log')
const getAuthToken = require('./getAuthToken')

/**
 * Checks the user has a session (is logged in) and returns the JWT claims,
 * otherwise returns null.
 */
module.exports = (event) => {
  try {
    const token = getAuthToken(event)

    if (!token) {
      return null
    }

    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    const message = get(err, 'message')
    if (message !== 'invalid signature' || message !== 'jwt expired') {
      log.error({ err })
    } else {
      log.info('User session invalid')
    }
    return null
  }
}
