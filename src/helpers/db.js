const { MongoClient, ObjectId } = require('mongodb')
const get = require('lodash.get')
const bcrypt = require('bcryptjs')
const log = require('./log')

const dbName = 'plum-tree'
let url, cachedDb

if (!process.env.MONGO_USER || !process.env.MONGO_PASSWORD) {
  log.info('using local DB')
  url = `mongodb://localhost:27017/${dbName}`
} else {
  log.info('using live DB')
  url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@plum-tree-zwelh.mongodb.net/${dbName}?retryWrites=true`
}

const connect = async (logAttributes = {}) => {
  if (cachedDb) {
    log.info(logAttributes, 'use cached database connection')
    return cachedDb
  } else {
    log.info(logAttributes, 'new connection to database')
  }

  const client = new MongoClient(url)
  await client.connect()
  log.info(logAttributes, 'Connected successfully to server')
  cachedDb = client.db('plum-tree')
  log.info(logAttributes, 'Caching DB connection')
  return cachedDb
}

const getTrees = async (author, logAttributes = {}) => {
  await connect(logAttributes)
  log.info(logAttributes, 'query database - getTrees')

  const query = { author, deleted: { $ne: true } }

  return cachedDb.collection('trees')
    .find(query)
    .project({ _id: 1, title: 1 })
    .toArray()
}

/**
 * Gets all trees for a user including those flagged as deleted.
 */
const getAllTrees = async (author, logAttributes = {}) => {
  await connect(logAttributes)
  log.info(logAttributes, 'query database - getAllTrees')

  const query = { author }

  return cachedDb.collection('trees')
    .find(query)
    .project({ _id: 1, title: 1 })
    .toArray()
}

const getPublishedTrees = async (query, options, logAttributes = {}) => {
  await connect(logAttributes)
  log.info(logAttributes, 'query database - getPublishedTrees')

  return cachedDb.collection('exported')
    .find(query, options)
    .toArray()
}

const getPublishedTree = async (treeId, logAttributes = {}) => {
  await connect(logAttributes)
  log.info(logAttributes, 'query database - getPublishedTree')

  const query = {
    _id: new ObjectId(treeId),
    deleted: { $ne: true }
  }

  return cachedDb.collection('exported')
    .findOne(query)
}

const deleteByIds = async (collection, ids, logAttributes) => {
  await connect(logAttributes)
  const query = { _id: { $in: ids } }
  return cachedDb.collection(collection)
    .deleteMany(query)
}

module.exports = {
  connect,
  /**
   * Given a string checks if it can be turned into an ObjectId.
   */
  isValidObjectId: (id) => {
    try {
      if (!id) {
        return false
      }
      const oid = new ObjectId(id)
      return Boolean(oid)
    } catch (err) {
      return false
    }
  },
  getSiteStats: async (logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'query database - getSiteStats')

    return Promise.all([
      cachedDb.collection('users').estimatedDocumentCount(),
      cachedDb.collection('trees').estimatedDocumentCount(),
      cachedDb.collection('exported').estimatedDocumentCount(),
      cachedDb.collection('uploads').estimatedDocumentCount()
    ])
      .then((values) => {
        return {
          userCount: values[0],
          treeCount: values[1],
          publishedTreesCount: values[2],
          imageCount: values[3]
        }
      })
  },
  countPublishedTrees: async (query, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'query database - countPublishedTrees')

    return cachedDb.collection('exported')
      .countDocuments(query)
  },
  getPublishedTrees,
  getPublishedTree,
  getTrees,
  getTree: async (treeId, author, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(
      Object.assign(
        { treeId, author },
        logAttributes
      ), 'query database - getTree')

    const query = {
      _id: new ObjectId(treeId),
      author,
      deleted: { $ne: true }
    }

    return cachedDb.collection('trees')
      .findOne(query)
  },
  getTreePeople: async (treeId, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'query database - getTreePeople')

    const query = {
      tree: treeId,
      deleted: { $ne: true }
    }

    return cachedDb.collection('people')
      .find(query)
      .toArray()
  },
  getPerson: async (personId, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'query database - getPerson')

    const query = {
      _id: new ObjectId(personId),
      deleted: { $ne: true }
    }

    return cachedDb.collection('people')
      .findOne(query)
  },
  getUser: async (username, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'query database - getUser')

    const query = {
      _id: username,
      deleted: { $ne: true }
    }

    return cachedDb.collection('users')
      .findOne(query)
  },
  updateUserEmail: async (username, email, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - updateUserEmail')

    return cachedDb.collection('users').findOneAndUpdate(
      { _id: username, deleted: { $ne: true } },
      { $set: { email } },
      { returnDocument: 'after' })
      .then(result => {
        const user = get(result, 'value')
        if (!user) {
          return null
        }
        delete user.bcrypt
        return user
      })
  },
  updateUserPassword: async (username, password, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - updateUserPassword')

    return cachedDb.collection('users').findOneAndUpdate(
      { _id: username },
      { $set: { bcrypt: bcrypt.hashSync(password, 10) } },
      { returnDocument: 'after' })
      .then(result => {
        const user = get(result, 'value')
        if (!user) {
          return null
        }
        delete user.bcrypt
        return user
      })
  },
  updateTree: async (treeId, author, tree, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - updateTree')

    const query = {
      _id: new ObjectId(treeId),
      author,
      deleted: { $ne: true }
    }
    const doc = { $set: tree }

    return cachedDb.collection('trees').findOneAndUpdate(
      query,
      doc,
      { returnDocument: 'after' })
      .then(result => {
        const updatedTree = get(result, 'value')
        if (!updatedTree) {
          return null
        }
        return updatedTree
      })
  },
  createTree: async (tree, author, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - createTree')

    // setup default data
    tree.author = author
    tree.data = {
      person: null,
      partners: []
    }

    return cachedDb.collection('trees')
      .insertOne(tree)
      .then(result => Object.assign({}, tree, {
        _id: result.insertedId
      }))
  },
  deleteTree: async (treeId, author, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - deleteTree')

    const query = {
      _id: new ObjectId(treeId),
      author
    }
    const doc = { $set: { deleted: true } }

    return cachedDb.collection('trees').findOneAndUpdate(
      query,
      doc,
      { returnDocument: 'after' })
      .then(result => {
        const updatedTree = get(result, 'value')
        if (!updatedTree) {
          return null
        }
        return updatedTree
      })
  },
  createPerson: async (person, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - createPerson')

    return cachedDb.collection('people')
      .insertOne(person)
      .then(result => Object.assign({}, person, {
        _id: result.insertedId
      }))
  },
  updatePerson: async (personId, person, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(Object.assign(
      { personId, person },
      logAttributes
    ), 'update database - updatePerson')

    const query = { _id: new ObjectId(personId), deleted: { $ne: true } }
    const attrsToUpdate = { $set: person }
    const options = { returnDocument: 'after' }

    // we cant update a persons Id or deleted flag so remove/ignore it
    // from the update hash
    delete attrsToUpdate.$set._id
    delete attrsToUpdate.$set.deleted

    // use find and modify so we can return the entire record
    return cachedDb.collection('people').findOneAndUpdate(query, attrsToUpdate, options)
      .then(result => {
        const updatedPerson = get(result, 'value')
        if (!updatedPerson) {
          return null
        }
        return updatedPerson
      })
  },
  deletePerson: async (personId, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - deletePerson')

    const query = {
      _id: new ObjectId(personId)
    }
    const doc = { $set: { deleted: true } }

    return cachedDb.collection('people').findOneAndUpdate(
      query,
      doc,
      { returnDocument: 'after' })
      .then(result => {
        const updatedPerson = get(result, 'value')
        if (!updatedPerson) {
          return null
        }
        return updatedPerson
      })
  },
  storePasswordResetToken: async (token, username, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - storePasswordResetToken')

    const hash = bcrypt.hashSync(token, 10)

    return cachedDb.collection('resetPasswords').insertOne({
      username,
      bcrypt: hash,
      created: new Date()
    })
  },
  getUsernames: async (email, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(Object.assign(
      { email },
      logAttributes
    ),
    'query database - getUsernames')

    return cachedDb.collection('users')
      .find({ email: { $regex: email, $options: 'i' } })
      .toArray()
      .then(users => users.map(user => user._id))
  },
  isPasswordResetTokenValid: async (token, username, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'query database - isPasswordResetTokenValid')

    return cachedDb.collection('resetPasswords')
      .find({ username })
      .sort({ created: -1 })
      .limit(1)
      .toArray()
      .then(results => {
        const resetRequest = results[0]

        if (!resetRequest) {
          log.warn('Password reset for %s no match for password reset in DB collection', username)
          return false
        }

        // check expire time
        const now = new Date()
        const { created } = resetRequest
        const hoursDiff = Math.abs(now.getTime() - created.getTime()) / (1000 * 60 * 60)
        if (hoursDiff >= 24) {
          log.warn({ created, hoursDiff }, 'Password reset for %s failed as reset request has expired', username)
          return false
        }

        // check token
        if (!bcrypt.compareSync(token, resetRequest.bcrypt)) {
          log.warn('Password reset for %s failed as token does not match hash', username)
          return false
        }

        return true
      })
  },
  removeForgotPasswordToken: async (username, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - removeForgotPasswordToken')

    return cachedDb.collection('resetPasswords')
      .deleteMany({ username })
  },
  createUser: async (username, password, email, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - createUser')

    const hash = bcrypt.hashSync(password, 10)

    return cachedDb.collection('users').insertOne({
      _id: username,
      email,
      bcrypt: hash,
      created: new Date()
    })
      .catch(err => {
      // dupe key (username)
        if (err.code === 11000) {
          log.info(logAttributes, 'User %s already exists.', username)
          return null
        }

        throw err
      })
  },
  setLastLogin: async (username, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - setLastLogin')

    return cachedDb.collection('users').findOneAndUpdate(
      { _id: username, deleted: { $ne: true } },
      { $set: { lastLogin: new Date() } },
      { returnDocument: 'after' })
      .then(result => {
        const user = get(result, 'value')
        if (!user) {
          return null
        }
        delete user.bcrypt
        return user
      })
  },
  deleteUserData: async (username, logAttributes = {}) => {
    await connect(logAttributes)

    log.info(
      Object.assign(
        { username },
        logAttributes
      ), 'update database - deleteUserData')

    const trees = await getAllTrees(username, logAttributes)
    const treeIds = trees.map(t => t._id)
    const published = await getPublishedTrees({ _id: { $in: treeIds } }, { projection: { _id: 1 } }, logAttributes)
    const publishedIds = published.map(p => p._id)
    const peopleQuery = { tree: { $in: treeIds.map(id => id.toString()) } }
    const people = await cachedDb.collection('people')
      .find(peopleQuery)
      .project({ _id: 1 })
      .toArray()
    const peopleIds = people.map(p => p._id)
    const resetPasswordsQuery = { username }
    const resetPasswords = await cachedDb.collection('resetPasswords')
      .find(resetPasswordsQuery)
      .project({ _id: 1 })
      .toArray()
    const resetPasswordIds = resetPasswords.map(p => p._id)

    log.info(Object.assign({ treeIds }, logAttributes), 'Trees to delete')
    log.info(Object.assign({ publishedIds }, logAttributes), 'Published trees to delete')
    log.info(Object.assign({ peopleIds }, logAttributes), 'People to delete')
    log.info(Object.assign({ resetPasswordIds }, logAttributes), 'Password reset entries to delete')

    await deleteByIds('people', peopleIds, logAttributes)
    await deleteByIds('trees', treeIds, logAttributes)
    await deleteByIds('exported', treeIds, logAttributes)
    await deleteByIds('resetPasswords', resetPasswordIds, logAttributes)
  },
  deleteUser: async (username, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(
      Object.assign(
        { username },
        logAttributes
      ), 'update database - deleteUser')

    return cachedDb.collection('users')
      .deleteOne({ _id: username })
  },
  publishTree: async (treeId, author, publishToGallery, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - publishTree')

    const treeQuery = {
      _id: new ObjectId(treeId),
      author,
      deleted: { $ne: true }
    }
    const peopleQuery = {
      tree: treeId,
      deleted: { $ne: true }
    }

    return Promise.all([
      cachedDb.collection('trees').findOne(treeQuery),
      cachedDb.collection('people').find(peopleQuery).toArray()
    ])
      .then((results) => {
        const treeResult = results[0]
        const peopleResult = results[1]
        const publish = {}

        if (!treeResult) {
          return null
        }

        publish.treeId = treeId
        publish.treeData = treeResult
        publish.treePeople = peopleResult

        return publish
      })
      .then(publishData => {
        if (!publishData) {
          return null
        }

        const { treeId, treeData, treePeople } = publishData
        const publishQuery = { _id: new ObjectId(treeId) }
        const doc = {
          $set: {
            title: treeData.title,
            description: treeData.description,
            cover: treeData.cover,
            data: treeData.data,
            people: treePeople,
            publishToGallery,
            lastPublishDate: new Date()
          },
          $unset: {
            deleted: ''
          }
        }
        const options = { upsert: true, returnDocument: 'after' }

        // use find and modify so we can return the entire record
        return cachedDb.collection('exported')
          .findOneAndUpdate(publishQuery, doc, options)
      })
  },
  unpublishTree: async (treeId, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'update database - unpublishTree')

    return cachedDb.collection('exported').findOneAndUpdate(
      { _id: new ObjectId(treeId) },
      { $set: { deleted: true } })
      .then(result => {
        const tree = get(result, 'value')
        if (!tree) {
          return null
        }
        return tree
      })
  },
  isImageUsedInPublishedTree: async (treeId, image, logAttributes = {}) => {
    const tree = await getPublishedTree(treeId, logAttributes)

    if (!tree) {
      return false
    }

    if (image.startsWith('cover/')) {
      return tree.cover === image
    }

    if (image.startsWith('avatar/')) {
      const people = get(tree, 'people', [])
      return people.filter(p => p.avatar === image).length > 0
    }

    return false
  },
  getUploadData: async (author, upload, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(logAttributes, 'query database - getUploadData')

    const query = { author, upload }

    return cachedDb.collection('uploads').findOne(query)
  },
  getTreeById: async (treeId, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(
      Object.assign(
        { treeId },
        logAttributes
      ), 'query database - getTreeById')

    const query = {
      _id: new ObjectId(treeId),
      deleted: { $ne: true }
    }

    return cachedDb.collection('trees')
      .findOne(query)
  },
  updatePublishedTreePeople: async (treeId, people, logAttributes = {}) => {
    await connect(logAttributes)
    log.info(
      Object.assign(
        { treeId, people },
        logAttributes
      ), 'update database - updatePublishedTreePeople')

    const query = { _id: new ObjectId(treeId), deleted: { $ne: true } }
    const attrsToUpdate = { $set: { people, migrated: true } }
    const options = { new: false }

    // use find and modify so we can return the entire record
    return cachedDb.collection('exported').findOneAndUpdate(query, attrsToUpdate, options)
      .then(result => {
        const updatedTree = get(result, 'value')
        if (!updatedTree) {
          return null
        }
        return updatedTree
      })
  }
}
