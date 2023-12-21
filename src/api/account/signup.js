const log = require('../../helpers/log')
const getRequestBody = require('../../helpers/getRequestBody')
const { createUser } = require('../../helpers/db')
const createSession = require('../../helpers/createSession')

const userAlreadyExists = {
  statusCode: 400,
  body: JSON.stringify({
    errors: [{
      title: 'Invalid Attribute',
      detail: 'This username has already been registered.'
    }]
  })
}

const validateInputData = (username, password, email) => {
  const errors = []

  // validate username is alphanumeric
  const alphaNumericTest = /[^a-zA-Z0-9]/
  if (username && alphaNumericTest.test(username)) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'Username must be alphanumeric.'
    })
  }

  // validate username is correct length
  if (!username || username.length < 3 || username.length > 100) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'Username must be more than 3 characters up to 100 characters.'
    })
  }

  // validate password
  if (!password || password.length === 0) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'Password is required.'
    })
  }

  // validate email
  const emailTest = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!email || (email && !emailTest.test(email))) {
    errors.push({
      title: 'Invalid Attribute',
      detail: 'Email is invalid.'
    })
  }

  return errors
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const { username, password, email } = getRequestBody(event)
  const errors = validateInputData(username, password, email)

  if (errors.length) {
    log.warn({ errors }, 'Login request had validation errors.')
    return {
      statusCode: 400,
      body: JSON.stringify({ errors })
    }
  }

  const userCreated = await createUser(username, password, email)

  if (!userCreated) {
    return userAlreadyExists
  }

  const token = createSession(username)

  return {
    statusCode: 200,
    body: JSON.stringify({ token })
  }
}
