const get = require('lodash.get')
const getSession = require('../../helpers/getSession')
const { isValidObjectId, getTree, getTreePeople } = require('../../helpers/db')

const unauthorized = {
  statusCode: 403,
  body: JSON.stringify({
    errors: [{
      title: 'Unauthorized',
      detail: 'Invalid user session, try logging in again.'
    }]
  })
}

const invalidTreeId = {
  statusCode: 400,
  body: JSON.stringify({
    errors: [{
      title: 'Invalid',
      detail: 'Can\'t get the people for this tree with an invalid tree Id.'
    }]
  })
}

const notFound = {
  statusCode: 404,
  body: JSON.stringify({
    errors: [{
      title: 'Not Found',
      detail: 'The tree does not exist.'
    }]
  })
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  const treeId = get(event, 'queryStringParameters.tree')
  const session = getSession(event)

  if (!session) {
    return unauthorized
  }

  if (!isValidObjectId(treeId)) {
    return invalidTreeId
  }

  const { username } = session
  const tree = await getTree(treeId, username)

  if (!tree) {
    return notFound
  }

  const people = await getTreePeople(treeId)

  return {
    statusCode: 200,
    body: JSON.stringify(people)
  }
}
