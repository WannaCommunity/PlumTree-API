const getSession = require('../../helpers/getSession')
const { getUser } = require('../../helpers/db')

const notFound = {
  statusCode: 404,
  body: JSON.stringify({
    errors: [{
      title: 'Not Found',
      detail: 'The user does not exist.'
    }]
  })
}

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

  const session = getSession(event)

  if (!session) {
    return unauthorized
  }

  const { username } = session
  const user = await getUser(username)

  if (!user) {
    return notFound
  }

  delete user.bcrypt

  return {
    statusCode: 200,
    body: JSON.stringify(user)
  }
}
