const get = require('lodash.get')
const getSession = require('../../helpers/getSession')
const { isValidObjectId, getPerson, getTree } = require('../../helpers/db')

const unauthorized = {
  statusCode: 403,
  body: JSON.stringify({
    errors: [{
      title: 'Unauthorized',
      detail: 'Invalid user session, try logging in again.'
    }]
  })
}

const notFound = {
  statusCode: 404,
  body: JSON.stringify({
    errors: [{
      title: 'Not Found',
      detail: 'The person does not exist.'
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

  const person = await getPerson(personId)

  if (!person) {
    return notFound
  }

  const { username } = session
  const { tree: treeId } = person
  const tree = await getTree(treeId, username)

  if (!tree) {
    return notFound
  }

  return {
    statusCode: 200,
    body: JSON.stringify(person)
  }
}
