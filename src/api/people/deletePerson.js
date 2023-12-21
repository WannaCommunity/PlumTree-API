const get = require('lodash.get')
const getSession = require('../../helpers/getSession')
const { isValidObjectId, getPerson, getTree, deletePerson } = require('../../helpers/db')

const notFound = {
  statusCode: 404,
  body: JSON.stringify({
    errors: [{
      title: 'Not Found',
      detail: 'The person does not exist.'
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

  const personId = get(event, 'pathParameters.id')
  const session = getSession(event)

  if (!session) {
    return unauthorized
  }

  if (!isValidObjectId(personId)) {
    return notFound
  }

  const dbRecord = await getPerson(personId)

  if (!dbRecord) {
    return notFound
  }

  const { username } = session
  const tree = await getTree(dbRecord.tree, username)

  if (!tree) {
    return notFound
  }

  const updatedPerson = await deletePerson(personId)

  if (!updatedPerson) {
    return notFound
  }

  return {
    statusCode: 204,
    body: null
  }
}
