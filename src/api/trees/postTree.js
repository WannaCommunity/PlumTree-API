const getSession = require('../../helpers/getSession')
const getRequestBody = require('../../helpers/getRequestBody')
const { createTree } = require('../../helpers/db')
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

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const tree = getRequestBody(event)
    const session = getSession(event)

    if (!session) {
      return unauthorized
    }

    // every tree needs to be created with a title
    if (!tree.title || tree.title.trim() === '') {
      const errors = [{
        title: 'Invalid Attribute',
        detail: 'The field "title" is required.'
      }]

      log.warn({ errors }, 'Tree create had validation errors')
      return {
        statusCode: 400,
        body: JSON.stringify({ errors })
      }
    }

    // move the cover image (if there is one) from the input bucket to the
    // processed bucket so it's persisted (input bucket will delete uploaded
    // images after 24 hours).
    if (tree.cover) {
      await moveFromInputToProcessed(tree.cover)
    }

    const { username } = session
    const createdTree = await createTree(tree, username)

    return {
      statusCode: 200,
      body: JSON.stringify(createdTree)
    }
  } catch (err) {
    log.error({ err }, 'Failed to create tree')

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
