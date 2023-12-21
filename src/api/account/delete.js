const bcrypt = require('bcryptjs')
const log = require('../../helpers/log')
const getSession = require('../../helpers/getSession')
const getRequestBody = require('../../helpers/getRequestBody')
const { getUser, deleteUserData, deleteUser } = require('../../helpers/db')

const unauthorized = {
  statusCode: 403,
  body: JSON.stringify({
    errors: [{
      title: 'Unauthorized',
      detail: 'Invalid session or password'
    }]
  })
}

const invalid = {
  statusCode: 400,
  body: JSON.stringify({
    errors: [{
      title: 'Invalid Attribute',
      detail: 'The field "password" is required.'
    }]
  })
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  log.info('attempting to delete users account')

  const body = getRequestBody(event)
  if (!body) {
    log.warn('Login request had validation errors no request body.')
    return invalid
  }

  const { resetAccount, password } = body
  if (!password) {
    log.warn('Login request had validation errors no password.')
    return invalid
  }

  const session = getSession(event)
  if (!session) {
    log.warn({ session }, 'Delete account request invalid session.')
    return unauthorized
  }

  const { username } = session
  const user = await getUser(username)
  if (!bcrypt.compareSync(password, user.bcrypt)) {
    log.warn({ username }, 'Delete account request incorrect password.')
    return unauthorized
  }

  await deleteUserData(username)
  if (!resetAccount) {
    await deleteUser(username)
  }

  return {
    statusCode: 204,
    body: null
  }
}
