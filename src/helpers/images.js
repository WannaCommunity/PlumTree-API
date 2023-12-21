const { S3 } = require('aws-sdk')
const s3 = new S3({ region: 'eu-west-1' })
const log = require('./log')

module.exports = {
  moveFromInputToProcessed: (image) => {
    log.info({ image }, 'Copying image from input to processed bucket')
    return s3.copyObject({
      Bucket: process.env.UPLOAD_BUCKET_PROCESSED,
      CopySource: `/${process.env.UPLOAD_BUCKET_INPUT}/${image}`,
      Key: image,
      TaggingDirective: 'REPLACE',
      Tagging: ''
    }).promise()
  },
  deleteProcessedImage: (image) => {
    log.info({ image }, 'Deleting image and any resized images from processed bucket')
    const parts = image.split('.')
    const params = {
      Bucket: process.env.UPLOAD_BUCKET_PROCESSED,
      Prefix: parts[0]
    }

    return s3.listObjects(params)
      .promise()
      .then(data => {
        const Objects = data.Contents.map(c => ({ Key: c.Key }))
        const params = {
          Bucket: process.env.UPLOAD_BUCKET_PROCESSED,
          Delete: {
            Objects
          }
        }
        log.info({ params }, 'Deleting objects')

        if (Objects.length === 0) {
          return Promise.resolve()
        }

        return s3.deleteObjects(params).promise()
      })
  }
}
