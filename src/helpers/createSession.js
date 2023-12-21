const jwt = require('jsonwebtoken')

/**
 * Returns a JWT token for a user session
 */
module.exports = (username) => {
  const JWT_SECRET = process.env.JWT_SECRET

  return jwt.sign({
    username,
    exp: Math.floor(Date.now() / 1000) + 129600 // 36 hours
  }, JWT_SECRET)
}
