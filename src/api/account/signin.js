const bcrypt = require('bcryptjs')
const log = require('../../helpers/log')
const getRequestBody = require('../../helpers/getRequestBody')
const { getUser, setLastLogin } = require('../../helpers/db')
const createSession = require('../../helpers/createSession')

const invalidCredentials = {
  statusCode: 403,
  body: JSON.stringify({
    errors: [{
      title: 'Unauthorized',
      detail: 'Invalid username and/or password'
    }]
  })
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const { username, password } = getRequestBody(event)
  const errors = []

  log.info({ username }, 'attempting to signin user')

  // validate
  if (!username) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'The field "username" is required.'
    })
  }
  if (!password) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'The field "password" is required.'
    })
  }

  if (errors.length) {
    log.warn({ errors }, 'Login request had validation errors.')
    return {
      statusCode: 400,
      body: JSON.stringify({ errors })
    }
  }

  const user = await getUser(username)

  if (!user) {
    return invalidCredentials
  }

  if (!bcrypt.compareSync(password, user.bcrypt)) {
    log.warn({ username }, 'Login request incorrect password.')
    return invalidCredentials
  }

  await setLastLogin(username)

  // Create JWT & respond
  const token = createSession(username)
  return {
    statusCode: 200,
    body: JSON.stringify({ token })
  }
}
