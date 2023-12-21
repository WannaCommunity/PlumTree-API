const get = require('lodash.get')
const { countPublishedTrees, getPublishedTrees } = require('../../helpers/db')
const log = require('../../helpers/log')

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const search = get(event, 'queryStringParameters.search', '')
    const pageNumber = parseInt(get(event, 'queryStringParameters["page[number]"]', 1))
    const pageSize = 50
    const query = {
      $and: [{
        publishToGallery: true
      }, {
        deleted: { $ne: true }
      }]
    }
    if (search) {
      query.$and.push({
        $text: {
          $search: search
        }
      })
    }
    const options = {
      limit: pageSize,
      skip: (pageNumber - 1) * pageSize,
      projection: { _id: 1, title: 1, description: 1, cover: 1 }
    }

    log.info({ query, options, search, pageNumber, pageSize }, 'Preparing to fetch published trees')
    log.info({ query }, 'Counting published trees with query')

    const treeCount = await countPublishedTrees(query)

    log.info({ query }, `Counted ${treeCount} published trees with query`)
    log.info({ query, options }, 'Fetching published trees')

    const trees = await getPublishedTrees(query, options)

    log.info({ query, options }, `Found ${trees.length} published trees`)

    return {
      statusCode: 200,
      isBase64Encoded: false,
      body: JSON.stringify({
        meta: {
          totalPages: Math.ceil(treeCount / pageSize),
          currentPage: pageNumber
        },
        data: trees
      })
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
