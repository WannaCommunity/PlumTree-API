const get = require('lodash.get')
const log = require('../../helpers/log')
const getSession = require('../../helpers/getSession')
const getRequestBody = require('../../helpers/getRequestBody')
const { isValidObjectId, getPublishedTree, publishTree } = require('../../helpers/db')
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
    const { publishToGallery } = getRequestBody(event)
    const session = getSession(event)

    if (!session) {
      return unauthorized
    }

    if (!isValidObjectId(treeId)) {
      return notFound
    }

    const { username } = session
    const origPublishedTree = await getPublishedTree(treeId)
    const publishedTree = await publishTree(treeId, username, Boolean(publishToGallery))

    if (!publishedTree) {
      return notFound
    }

    const origTreeCover = get(origPublishedTree, 'cover', null)
    const newTreeCover = get(publishedTree, 'cover', null)

    if (origTreeCover && origTreeCover !== newTreeCover) {
      await deleteProcessedImage(origTreeCover)
    }

    return {
      statusCode: 204,
      body: null
    }
  } catch (err) {
    log.error({ err }, 'Failed to get published trees')

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
