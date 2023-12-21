const log = require('../../helpers/log')
const getRequestBody = require('../../helpers/getRequestBody')
const { isPasswordResetTokenValid, removeForgotPasswordToken, updateUserPassword } = require('../../helpers/db')

const notFound = {
  statusCode: 404,
  body: JSON.stringify({
    errors: [{
      title: 'Not Found',
      detail: 'The user does not exist.'
    }]
  })
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const { username, token, password } = getRequestBody(event)
  const errors = []

  if (!username) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'Username is missing from your request.'
    })
  }
  if (!token) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'The password reset token is missing from your request.'
    })
  }
  if (!password) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'The password is missing from your request.'
    })
  }

  if (errors.length) {
    log.warn({ errors }, 'Login request had validation errors.')
    return {
      statusCode: 400,
      body: JSON.stringify({ errors })
    }
  }

  const validToken = await isPasswordResetTokenValid(token, username)
  if (!validToken) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: [{
          title: 'Invalid Attribute',
          detail: 'The password reset token invalid.'
        }]
      })
    }
  }

  await removeForgotPasswordToken(username)
  const updatedUser = await updateUserPassword(username, password)

  if (!updatedUser) {
    return notFound
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedUser)
  }
}
