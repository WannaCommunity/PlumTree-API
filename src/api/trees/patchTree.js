const get = require('lodash.get')
const log = require('../../helpers/log')
const getSession = require('../../helpers/getSession')
const getRequestBody = require('../../helpers/getRequestBody')
const { getTree, updateTree, isImageUsedInPublishedTree } = require('../../helpers/db')
const { deleteProcessedImage, moveFromInputToProcessed } = require('../../helpers/images')

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
    const tree = getRequestBody(event)
    const session = getSession(event)

    if (!session) {
      return unauthorized
    }

    const { username } = session
    const origTree = await getTree(treeId, username)
    if (!origTree) {
      return notFound
    }

    // title cant be empty/blank if set
    if ('title' in tree && tree.title.trim() === '') {
      const errors = [{
        title: 'Invalid Attribute',
        detail: 'The field "title" is required.'
      }]

      log.warn({ errors }, 'Tree update had validation errors')
      return {
        statusCode: 400,
        body: JSON.stringify({ errors })
      }
    }

    const updatedTree = await updateTree(treeId, username, tree)

    if (!updatedTree) {
      return notFound
    }

    if (tree.cover !== undefined) {
      const origTreeCover = get(origTree, 'cover', null)
      const newTreeCover = get(tree, 'cover', null)

      if (newTreeCover && newTreeCover !== origTreeCover) {
        await moveFromInputToProcessed(newTreeCover)
      }

      if (origTreeCover && newTreeCover !== origTreeCover) {
        const publishedImage = await isImageUsedInPublishedTree(treeId, origTreeCover)
        if (!publishedImage) {
          await deleteProcessedImage(origTreeCover)
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(updatedTree)
    }
  } catch (err) {
    log.error({ err }, 'Failed to update tree')

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
