require('dotenv').config()
const AdmZip = require('adm-zip')
const aws = require('aws-sdk')
const log = require('../helpers/log')
const { getTree, getTreePeople } = require('../helpers/db')

const prepareDownload = async () => {
  try {
    const treeId = process.env.DOWNLOAD_TREE_ID
    const username = process.env.DOWNLOAD_TREE_USERNAME

    log.info({ username, treeId }, 'Getting treeeeeese data')

    const tree = await getTree(treeId, username)
    const people = await getTreePeople(treeId)

    if (!tree) {
      log.info({ username, treeId }, 'Tree not found')
      process.exit(1)
    }

    log.info({ username, treeId }, 'Tree found and starting to build download')
    const zip = new AdmZip()

    // add static files
    zip.addLocalFile('./src/download/55f86e404c6510403986.317.js')
    zip.addLocalFile('./src/download/55f86e404c6510403986.main.css')
    zip.addLocalFile('./src/download/55f86e404c6510403986.main.js')
    zip.addLocalFile('./src/download/79b86a4012d91b58d24d.woff')
    zip.addLocalFile('./src/download/662d4bc3097ab79ca543.jpg')
    zip.addLocalFile('./src/download/834e711fea0da201416e.svg')
    zip.addLocalFile('./src/download/tree.html')

    log.info('Static files added to download')

    // add data files
    const treeJson = `var tree=${JSON.stringify(tree)}`
    const peopleJson = `var people=${JSON.stringify(people)}`
    zip.addFile('data/tree.js', Buffer.from(treeJson, 'utf8'), 'tree JSON data')
    zip.addFile('data/people.js', Buffer.from(peopleJson, 'utf8'), 'people JSON data')

    log.info('Data files added to download')

    // add images
    const s3 = new aws.S3({ apiVersion: '2006-03-01' })
    const peopleAvatars = people.filter(p => p.avatar)
      .map(p => p.avatar)

    log.info(`${peopleAvatars.length} people images to process`)

    const totalPeople = peopleAvatars.length
    let processedPeople = 0
    await Promise.all(peopleAvatars.map(avatar => {
      return s3.getObject({
        Bucket: 'com.theplumtreeapp.upload-processed',
        Key: avatar
      }).promise()
        .then(data => {
          const imageTmp = avatar.split('/').pop()
          zip.addFile(`images/avatar/${imageTmp}`, data.Body)
        })
        .catch(err => {
          if (err.name === 'NoSuchKey') {
            // could not find avatar image in bucket, this is fine just ignore.
            log.warn({ err, avatar }, 'Ignoring missing person avatar')
            return
          }
          log.warn({ err, avatar }, 'Failed to get person avatar')
        })
        .finally(() => {
          processedPeople++
          log.info(`${processedPeople} / ${totalPeople} people processed`)
        })
    }))

    log.info('People image files added to download')

    if (tree.cover) {
      await s3.getObject({
        Bucket: 'com.theplumtreeapp.upload-processed',
        Key: tree.cover
      }).promise()
        .then(data => {
          const imageTmp = tree.cover.split('/').pop()
          zip.addFile(`images/cover/${imageTmp}`, data.Body)
        })
        .catch(err => {
          if (err.name === 'NoSuchKey') {
            // could not find cover image in bucket, this is fine just ignore.
            log.warn({ err, cover: tree.cover }, 'Ignoring missing tree cover')
            return
          }
          log.warn({ err, cover: tree.cover }, 'Failed to get tree cover')
        })
    }

    log.info('Cover image added to download')

    zip.writeZip(`downloads/${treeId}.zip`)

    log.info({ file: `downloads/${treeId}.zip` }, 'Download saved to disk')
    process.exit(0)
  } catch (err) {
    log.error({ err }, 'Failed to download tree')
    process.exit(1)
  }
}

prepareDownload()
