const log = require('../../helpers/log')
const getSession = require('../../helpers/getSession')
const { getTrees } = require('../../helpers/db')

const unauthorized = {
  statusCode: 403,
  body: JSON.stringify({
    errors: [{
      title: 'Unauthorized',
      detail: 'Invalid user session, try logging in again.'
    }]
  })
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const session = getSession(event)

    if (!session) {
      return unauthorized
    }

    const { username } = session
    const trees = await getTrees(username)

    return {
      statusCode: 200,
      body: JSON.stringify(trees)
    }
  } catch (err) {
    log.error({ err }, 'Failed to get users trees')

    return {
      statusCode: 500,
      body: JSON.stringify({
        errors: [{
          title: 'Internal Error',
          detail: 'Something went wrong, please try again later.'
        }]
      })
    }
  }
}
