/**
 * Headers are case insensitive, however API Gateway + Lambda proxy deals with
 * them in a case sensitive manner. This utility function simply returns a new
 * object where header keys have been lowercased.
 */
module.exports = (event, maskSensitive = true) => {
  const sensitive = ['cookie']
  const headers = {}

  for (const key in event.headers) {
    if (maskSensitive && sensitive.includes(key.toLowerCase())) {
      headers[key.toLowerCase()] = '*****'
    } else {
      headers[key.toLowerCase()] = event.headers[key]
    }
  }

  return headers
}
