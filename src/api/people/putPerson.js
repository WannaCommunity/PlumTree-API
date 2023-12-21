const get = require('lodash.get')
const getSession = require('../../helpers/getSession')
const getRequestBody = require('../../helpers/getRequestBody')
const { isValidObjectId, getPerson, getTree, updatePerson, isImageUsedInPublishedTree } = require('../../helpers/db')
const { moveFromInputToProcessed, deleteProcessedImage } = require('../../helpers/images')

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
  const person = getRequestBody(event)
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
  const treeId = dbRecord.tree
  const tree = await getTree(treeId, username)

  if (!tree) {
    return notFound
  }

  // checked the person exists and is in a tree the user owns so now we can
  // update the person
  const updatedPerson = await updatePerson(personId, person)

  if (!updatedPerson) {
    return notFound
  }

  const origAvatar = get(dbRecord, 'avatar', null)
  const newAvatar = get(person, 'avatar', null)

  if (newAvatar && newAvatar !== origAvatar) {
    await moveFromInputToProcessed(newAvatar)
  }

  if (origAvatar && newAvatar !== origAvatar) {
    const publishedImage = await isImageUsedInPublishedTree(treeId, origAvatar)
    if (!publishedImage) {
      await deleteProcessedImage(origAvatar)
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedPerson)
  }
}
