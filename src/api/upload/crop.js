const sharp = require('sharp')
const uuid = require('uuid')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({ region: 'eu-west-1' })
const getSession = require('../../helpers/getSession')
const getRequestBody = require('../../helpers/getRequestBody')
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

const getNewFilename = (image) => {
  const actionId = uuid.v4()
  const ext = image.split('.').pop()

  if (image.startsWith('avatar/')) {
    return `avatar/${actionId}.${ext}`
  } else if (image.startsWith('cover/')) {
    return `cover/${actionId}.${ext}`
  }
  return `cover/${actionId}.${ext}`
}

const crop = (imageName, imageBuffer, imageContentType, extract) => {
  return new Promise((resolve, reject) => {
    sharp(imageBuffer)
      .extract(extract)
      .toBuffer(async (err, Body) => {
        if (err) {
          log.error({ err, extract, imageName }, 'Failed to crop image')
          return reject(err)
        }

        const Key = getNewFilename(imageName)
        const Bucket = process.env.UPLOAD_BUCKET_INPUT
        const ContentType = imageContentType
        const params = {
          Bucket,
          Key,
          ContentType,
          Body
        }

        // files saved with the temp tag are deleted after 24 hours via
        // lifecycle policy.
        // todo - do this for avatars too
        if (Key.startsWith('cover/')) {
          params.Tagging = 'temp=true'
        }
        await s3.putObject(params).promise()
        resolve(Key)
      })
  })
}

exports.handler = async (event, context) => {
  try {
    const session = getSession(event)

    if (!session) {
      return unauthorized
    }

    const { username } = session
    const { cropData, image } = getRequestBody(event)
    const { x, y, width, height } = cropData
    const extract = { left: x, top: y, width, height }

    log.info({ extract, image, username }, 'I will now crop an image.')

    const Key = image
    const Bucket = process.env.UPLOAD_BUCKET_INPUT
    const fetchedFileDataFromAWS = await s3.getObject({ Bucket, Key }).promise()
    const { Body, ContentType } = fetchedFileDataFromAWS
    const imageBuffer = Buffer.from(Body)

    const newFilename = await crop(image, imageBuffer, ContentType, extract)

    return {
      statusCode: 200,
      isBase64Encoded: false,
      body: JSON.stringify({
        filename: newFilename
      })
    }
  } catch (err) {
    log.error({ err }, 'Failed to crop image')

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
