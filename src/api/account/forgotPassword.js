const fs = require('fs')
const path = require('path')
const handlebars = require('handlebars')
const nodemailer = require('nodemailer')
const log = require('../../helpers/log')
const getRequestBody = require('../../helpers/getRequestBody')
const { generateResetLink, generateToken } = require('../../helpers/account')
const { getUser, storePasswordResetToken } = require('../../helpers/db')

// email settings
const smtpEndpoint = process.env.SMTP_ENDPOINT
const port = 587
const from = `The Plum Tree <noreply@${process.env.DOMAIN}>`
const smtpUsername = process.env.SMTP_USERNAME
const smtpPassword = process.env.SMTP_PASSWORD
const subject = 'Password Reset Instructions'

const generatePasswordResetMessage = (username, resetToken) => {
  const link = generateResetLink(username, resetToken)
  const htmlTemplate = fs.readFileSync(path.join(__dirname, '/../../templates/password-reset.html'), 'utf-8')
  return handlebars.compile(htmlTemplate)({
    username,
    link
  })
}

const sendResetPasswordEmail = async (to, html) => {
  log.info({ to, html }, 'Preparing password reset email')

  const transporter = nodemailer.createTransport({
    host: smtpEndpoint,
    port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: smtpUsername,
      pass: smtpPassword
    }
  })

  const mailOptions = { from, to, subject, html }

  const info = await transporter.sendMail(mailOptions)

  log.info({ info }, 'Message sent!')
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false

  try {
    const { username } = getRequestBody(event)

    if (!username) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          errors: [{
            title: 'Invalid Attribute',
            detail: 'Please enter a valid username.'
          }]
        })
      }
    }

    const token = generateToken()
    const user = await getUser(username)

    if (!user || !user.email) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          errors: [{
            title: 'Not Found',
            detail: 'No user with that username was found.'
          }]
        })
      }
    }

    await storePasswordResetToken(token, username)
    const message = generatePasswordResetMessage(username, token)
    await sendResetPasswordEmail(user.email, message)

    return {
      statusCode: 204,
      body: null
    }
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
