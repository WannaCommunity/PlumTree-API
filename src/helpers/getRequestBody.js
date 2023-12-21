const { Base64 } = require('js-base64')
const log = require('./log')

/**
 * Request bodies can be base 64 encoded so this util checks if it is and
 * decodes if required. It then parses the resulting string into a JSON object
 * as all request bodies to plum tree should be JSON.
 */
module.exports = (event) => {
  try {
    if (event.isBase64Encoded) {
      return JSON.parse(Base64.decode(event.body))
    }
    return JSON.parse(event.body)
  } catch (err) {
    log.error({ err }, `Failed to get process request body "${event.body}"`)
    throw err
  }
}
