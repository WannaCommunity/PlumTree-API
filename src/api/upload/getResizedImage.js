const sharp = require('sharp')
const AWS = require('aws-sdk')
const s3 = new AWS.S3({ signatureVersion: 'v4' })
const log = require('../../helpers/log')

const Bucket = process.env.UPLOAD_BUCKET_PROCESSED

exports.handler = async (event, context) => {
  try {
    log.info('Get resized image')

    const { dimensions, image } = event.pathParameters
    const { width, height, error: dimensionsError } = extractDimensions(dimensions)

    if (dimensionsError) {
      log.warn({ dimensions }, 'invalid dimensions given')
      return {
        statusCode: 400,
        body: dimensionsError
      }
    }

    const imageFound = await imageExists(image)
    if (!imageFound) {
      log.info({ image }, 'image not found')
      return {
        statusCode: 404,
        body: null
      }
    }

    log.info({ width, height, image }, 'resizing image')

    const returnImage = await getResizedImage(image, width, height)

    const body = returnImage.Body.toString('base64')
    const lambdaPayloadLimit = 6 * 1024 * 1024
    if (body.length > lambdaPayloadLimit) {
      log.warn({ image, size: body.length }, 'image too large')
      return {
        statusCode: 413,
        body: 'The converted image is too large to return.'
      }
    }

    return {
      statusCode: 200,
      body,
      isBase64Encoded: true,
      headers: {
        'Content-Type': returnImage.ContentType || 'image'
      }
    }
  } catch (err) {
    log.error({ err }, 'get user badges error')

    return {
      statusCode: 500,
      body: 'error'
    }
  }
}

const extractDimensions = dimensions => {
  // validate format "NumberxNumber"
  const regex = /^\d+x\d+$/
  if (regex.test(dimensions)) {
    const [width, height] = dimensions.split('x').map(i => parseInt(i))
    return { width, height }
  }

  return {
    error: 'Invalid dimensions'
  }
}

const imageExists = async (Key) => {
  try {
    // early escape (only migrated cover or avatar images can be resized)
    if (!Key.startsWith('cover/') && !Key.startsWith('avatar/')) {
      log.info('image is not a cover/avatar image')
      return false
    }

    await s3.headObject({
      Bucket, Key
    }).promise()

    return true
  } catch (err) {
    if (err.code === 'NotFound') {
      log.info('image was not found')
      return false
    }
    log.error({ err }, 'failed to check if image exists')
    throw err
  }
}

const getResizedImageName = (image, width, height) => {
  const parts = image.split('.')
  return `${parts[0]}-${width}x${height}.${parts[1]}`
}

const getResizedImage = async (image, width, height) => {
  try {
    const resizedName = getResizedImageName(image, width, height)

    // check if image has already been resized (early escape for images already
    // processed)
    const imageFound = await imageExists(resizedName)
    if (imageFound) {
      log.info('image already resized, fetching image')
      return getImageFromS3(resizedName)
    }

    log.info('image not yet resized, creating new image')
    return resizeImage(image, width, height)
  } catch (err) {
    log.error({ err }, 'Failed to get resized image')
  }
}

const getImageFromS3 = (Key) => {
  log.info(`Getting ${Key} from bucket`)
  return s3.getObject({
    Bucket,
    Key
  }).promise()
}

const resizeImage = async (image, width, height) => {
  try {
    log.info({ image, width, height }, 'creating resized image')
    const resizedName = getResizedImageName(image, width, height)
    const orig = await getImageFromS3(image)

    return sharp(orig.Body)
      .rotate()
      .resize({ width, height })
      .toBuffer()
      .then(data => saveImageToS3(resizedName, data))
  } catch (err) {
    log.error({ err }, 'Image resize failed')
  }
}

const saveImageToS3 = (Key, Body) => {
  log.info(`saving ${Key} to uploads bucket`)

  const ContentType = getContentType(Key)
  const params = {
    Bucket,
    Key,
    Body,
    ContentType
  }

  return s3.putObject(params)
    .promise()
    .then(() => params)
}

const getContentType = image => {
  return image.split('.')[1] === 'png' ? 'image/png' : 'image/jpeg'
}
