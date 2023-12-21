const getSession = require('../../helpers/getSession')
const getRequestBody = require('../../helpers/getRequestBody')
const { updateUserEmail } = require('../../helpers/db')
const isValidEmail = require('../../helpers/isValidEmail')

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

const invalid = {
  statusCode: 400,
  body: JSON.stringify({
    errors: [{
      title: 'Invalid Attribute',
      detail: 'The email you gave does not appear to be a valid email address.'
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
  const { email } = getRequestBody(event)

  if (!isValidEmail(email)) {
    return invalid
  }

  const updatedUser = await updateUserEmail(username, email)

  if (!updatedUser) {
    return notFound
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedUser)
  }
}
