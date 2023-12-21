const uuid = require('uuid')
const get = require('lodash.get')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({ signatureVersion: 'v4' })
const log = require('../../helpers/log')
const getSession = require('../../helpers/getSession')

const unauthorized = {
  statusCode: 403,
  body: JSON.stringify({
    errors: [{
      title: 'Unauthorized',
      detail: 'Invalid user session, try logging in again.'
    }]
  })
}

exports.handler = async event => {
  try {
    const session = getSession(event)

    if (!session) {
      return unauthorized
    }

    const { username } = session
    const actionId = uuid.v4()
    const type = get(event, 'queryStringParameters.type')
    const dir = get(event, 'queryStringParameters.dir')
    const acceptedFileTypes = ['image/png', 'image/jpeg']
    const acceptedDirs = ['avatar', 'cover']

    if (!acceptedFileTypes.includes(type)) {
      log.info({ username }, `invalid file type "${type}" for upload`)

      return {
        statusCode: 400,
        body: 'invalid file type'
      }
    }

    if (!acceptedDirs.includes(dir)) {
      log.info({ username }, `invalid file directory "${dir}" for upload`)

      return {
        statusCode: 400,
        body: 'invalid file directory'
      }
    }

    const ext = type === 'image/png' ? 'png' : 'jpg'
    const s3Params = {
      Bucket: process.env.UPLOAD_BUCKET_INPUT,
      Key: `${dir}/${actionId}.${ext}`,
      ContentType: type,
      ACL: 'public-read'
    }

    return new Promise((resolve) => {
      const uploadURL = s3.getSignedUrl('putObject', s3Params)
      resolve({
        statusCode: 200,
        isBase64Encoded: false,
        body: JSON.stringify({
          uploadURL,
          filename: `${dir}/${actionId}.${ext}`
        })
      })
    })
  } catch (err) {
    log.error({ err })

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
