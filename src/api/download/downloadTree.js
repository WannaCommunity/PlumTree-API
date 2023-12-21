const get = require('lodash.get')
const AdmZip = require('adm-zip')
const aws = require('aws-sdk')
const log = require('../../helpers/log')
const getSession = require('../../helpers/getSession')
const { getTree, getTreePeople } = require('../../helpers/db')

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
  const { awsRequestId: trace } = context

  try {
    const treeId = get(event, 'pathParameters.id')
    log.info({ treeId, trace }, 'Got request to download tree')
    const session = getSession(event)

    if (!session) {
      log.info({ trace }, 'Invalid session for downloading tree')
      return unauthorized
    }

    const { username } = session

    log.info({ username, treeId, trace }, 'Getting tree data')
    const tree = await getTree(treeId, username)
    const people = await getTreePeople(treeId)

    if (!tree) {
      log.info({ username, treeId, trace }, 'Tree not found')
      return notFound
    }

    log.info({ username, treeId, trace }, 'Tree found and starting to build download')
    const zip = new AdmZip()

    // add static files
    zip.addLocalFile('./src/download/55f86e404c6510403986.317.js')
    zip.addLocalFile('./src/download/55f86e404c6510403986.main.css')
    zip.addLocalFile('./src/download/55f86e404c6510403986.main.js')
    zip.addLocalFile('./src/download/79b86a4012d91b58d24d.woff')
    zip.addLocalFile('./src/download/662d4bc3097ab79ca543.jpg')
    zip.addLocalFile('./src/download/834e711fea0da201416e.svg')
    zip.addLocalFile('./src/download/tree.html')

    log.info({ trace }, 'Static files added to download')

    // add data files
    const treeJson = `var tree=${JSON.stringify(tree)}`
    const peopleJson = `var people=${JSON.stringify(people)}`
    zip.addFile('data/tree.js', Buffer.from(treeJson, 'utf8'), 'tree JSON data')
    zip.addFile('data/people.js', Buffer.from(peopleJson, 'utf8'), 'people JSON data')

    log.info({ trace }, 'Data files added to download')

    // add images
    const s3 = new aws.S3({ apiVersion: '2006-03-01' })
    const peopleAvatars = people.filter(p => p.avatar)
      .map(p => p.avatar)

    await Promise.all(peopleAvatars.map(avatar => {
      return s3.getObject({
        Bucket: process.env.UPLOAD_BUCKET_PROCESSED,
        Key: avatar
      }).promise()
        .then(data => {
          const imageTmp = avatar.split('/').pop()
          zip.addFile(`images/avatar/${imageTmp}`, data.Body)
        })
        .catch(err => {
          if (err.name === 'NoSuchKey') {
            // could not find avatar image in bucket, this is fine just ignore.
            log.warn({ err, avatar, trace }, 'Ignoring missing person avatar')
            return
          }
          log.warn({ err, avatar, trace }, 'Failed to get person avatar')
        })
    }))

    log.info({ trace }, 'People image files added to download')

    if (tree.cover) {
      await s3.getObject({
        Bucket: process.env.UPLOAD_BUCKET_PROCESSED,
        Key: tree.cover
      }).promise()
        .then(data => {
          const imageTmp = tree.cover.split('/').pop()
          zip.addFile(`images/cover/${imageTmp}`, data.Body)
        })
        .catch(err => {
          if (err.name === 'NoSuchKey') {
            // could not find cover image in bucket, this is fine just ignore.
            log.warn({ err, cover: tree.cover, trace }, 'Ignoring missing tree cover')
            return
          }
          log.warn({ err, cover: tree.cover, trace }, 'Failed to get tree cover')
        })
    }

    log.info({ trace }, 'Cover image added to download')

    // Upload to S3 as Lambda response size is limited which is an issue for
    // larger trees
    await s3.putObject({
      Bucket: process.env.UPLOAD_BUCKET_INPUT,
      Key: `downloads/${treeId}.zip`,
      Body: zip.toBuffer(),
      Tagging: 'temp=true'
    }).promise()

    log.info({ trace, file: `downloads/${treeId}.zip` }, 'Download uploaded to S3')

    const downloadURL = s3.getSignedUrl('getObject', {
      Bucket: process.env.UPLOAD_BUCKET_INPUT,
      Key: `downloads/${treeId}.zip`
    })

    log.info({ trace, file: `downloads/${treeId}.zip` }, 'Signed URL generated')

    return {
      statusCode: 200,
      isBase64Encoded: false,
      body: JSON.stringify({
        downloadURL,
        filename: `downloads/${treeId}.zip`
      })
    }
  } catch (err) {
    log.error({ err, trace }, 'Failed to get tree')

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
