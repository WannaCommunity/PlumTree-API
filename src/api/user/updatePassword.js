const bcrypt = require('bcryptjs')
const log = require('../../helpers/log')
const getSession = require('../../helpers/getSession')
const getRequestBody = require('../../helpers/getRequestBody')
const { getUser, updateUserPassword } = require('../../helpers/db')

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

const invalidPassword = {
  statusCode: 403,
  body: JSON.stringify({
    errors: [{
      title: 'Unauthorized',
      detail: 'Your current password was not correct.'
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
  const { oldPassword, newPassword, confirmPassword } = getRequestBody(event)
  const errors = []

  if (!oldPassword) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'Your current password is required.'
    })
  }
  if (!newPassword) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'A new password is required.'
    })
  }
  if (!confirmPassword) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'A confirmation of your new password is required.'
    })
  }
  if (newPassword !== confirmPassword) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'Your new password and confirm password do not match.'
    })
  }
  if (newPassword && newPassword.length < 8) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'Your new password should be at least 8 characters'
    })
  }

  if (errors.length) {
    log.warn({ errors }, 'Password update had validation errors')
    return {
      statusCode: 400,
      body: JSON.stringify({ errors })
    }
  }

  const user = await getUser(username)

  if (!user) {
    return notFound
  }

  if (!bcrypt.compareSync(oldPassword, user.bcrypt)) {
    return invalidPassword
  }

  const updatedUser = await updateUserPassword(username, newPassword)

  if (!updatedUser) {
    return notFound
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedUser)
  }
}
