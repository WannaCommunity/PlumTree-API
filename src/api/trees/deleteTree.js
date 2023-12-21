const get = require('lodash.get')
const log = require('../../helpers/log')
const getSession = require('../../helpers/getSession')
const { isValidObjectId, deleteTree, unpublishTree } = require('../../helpers/db')

const notFound = {
  statusCode: 404,
  body: JSON.stringify({
    errors: [{
      title: 'Not Found',
      detail: 'The tree does not exist.'
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

  try {
    const treeId = get(event, 'pathParameters.id')
    const session = getSession(event)

    if (!session) {
      return unauthorized
    }

    if (!isValidObjectId(treeId)) {
      return notFound
    }

    const { username } = session
    const updatedTree = await deleteTree(treeId, username)

    if (!updatedTree) {
      return notFound
    }

    await unpublishTree(treeId)

    return {
      statusCode: 204,
      body: null
    }
  } catch (err) {
    log.error({ err }, 'Failed to delete tree')

    return {
      statusCode: 500,
      body: JSON.stringify({
        errors: [{
          title: 'Internal Error',
          detail: 'Something went wrong, please try again later.'
        }]
      })
    }
  }
}
