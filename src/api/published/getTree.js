const get = require('lodash.get')
const log = require('../../helpers/log')
const { isValidObjectId, getPublishedTree } = require('../../helpers/db')

const notFound = {
  statusCode: 404,
  body: JSON.stringify({
    errors: [{
      title: 'Not Found',
      detail: 'The exported tree does not exist.'
    }]
  })
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const treeId = get(event, 'pathParameters.id')

    if (!isValidObjectId(treeId)) {
      return notFound
    }

    const tree = await getPublishedTree(treeId)

    if (!tree) {
      return notFound
    }

    return {
      statusCode: 200,
      body: JSON.stringify(tree)
    }
  } catch (err) {
    log.error({ err }, 'Failed to get published tree')

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
