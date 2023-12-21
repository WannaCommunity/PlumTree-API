const get = require('lodash.get')
const getSession = require('../../helpers/getSession')
const getRequestBody = require('../../helpers/getRequestBody')
const { isValidObjectId, getTree, createPerson } = require('../../helpers/db')
const { moveFromInputToProcessed } = require('../../helpers/images')
const log = require('../../helpers/log')

const unauthorized = {
  statusCode: 403,
  body: JSON.stringify({
    errors: [{
      title: 'Unauthorized',
      detail: 'Invalid user session, try logging in again.'
    }]
  })
}

const genericValidationError = {
  statusCode: 400,
  body: JSON.stringify({
    errors: [{
      title: 'Invalid Attribute',
      detail: 'Invalid arguments given.'
    }]
  })
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const person = getRequestBody(event)
  const session = getSession(event)

  if (!session) {
    return unauthorized
  }

  if (!isValidObjectId(get(person, 'tree'))) {
    log.warn({ person, error: 'Invalid tree Id' }, 'Person create had validation errors.')
    return genericValidationError
  }

  const { username } = session

  const tree = await getTree(person.tree, username)

  if (!tree) {
    log.warn({ person, error: 'Tree not found' }, 'Person create had validation errors.')
    return genericValidationError
  }

  const createdPerson = await createPerson(person)

  if (createdPerson.avatar) {
    await moveFromInputToProcessed(createdPerson.avatar)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(createdPerson)
  }
}
