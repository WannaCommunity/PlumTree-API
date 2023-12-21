const get = require('lodash.get')
const log = require('../../helpers/log')
const getSession = require('../../helpers/getSession')
const { isValidObjectId, getTree, unpublishTree } = require('../../helpers/db')
const { deleteProcessedImage } = require('../../helpers/images')

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
    const tree = await getTree(treeId, username)

    if (!tree) {
      return notFound
    }

    const unpublishedTree = await unpublishTree(treeId)

    const publishedTreeCover = get(unpublishedTree, 'cover', null)
    const treeCover = get(tree, 'cover', null)

    if (publishedTreeCover && publishedTreeCover !== treeCover) {
      await deleteProcessedImage(publishedTreeCover)
    }

    return {
      statusCode: 204,
      body: null
    }
  } catch (err) {
    log.error({ err }, 'Failed to unpublish tree')

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
