const getHeaders = require('./getHeaders')
/**
 * Headers are case insensitive, however API Gateway + Lambda proxy deals with
 * them in a case sensitive manner. This utility function simply returns a new
 * object where header keys have been lowercased.
 */
module.exports = (event) => {
  const headers = getHeaders(event)
  const authHeader = headers.authorization

  if (!authHeader) {
    return null
  }

  return authHeader.split(' ').pop()
}
