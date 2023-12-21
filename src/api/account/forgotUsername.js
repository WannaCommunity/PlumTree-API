
const fs = require('fs')
const path = require('path')
const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const log = require('../../helpers/log')
const getRequestBody = require('../../helpers/getRequestBody')
const { getUsernames } = require('../../helpers/db')

// email settings
const smtpEndpoint = process.env.SMTP_ENDPOINT
const port = 587
const from = `The Plum Tree <noreply@${process.env.DOMAIN}>`
const smtpUsername = process.env.SMTP_USERNAME
const smtpPassword = process.env.SMTP_PASSWORD
const subject = 'Forgot Username'

const generateForgotUsernameMessage = (usernames) => {
  const htmlTemplate = fs.readFileSync(path.join(__dirname, '/../../templates/forgot-username.html'), 'utf-8')
  return handlebars.compile(htmlTemplate)({
    usernames
  })
}

const generateNoUsernameMatchMessage = () => {
  const htmlTemplate = fs.readFileSync(path.join(__dirname, '/../../templates/forgot-username-no-match.html'), 'utf-8')
  return handlebars.compile(htmlTemplate)()
}

const sendForgotUsernameEmail = async (to, html) => {
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
    const { email } = getRequestBody(event)

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          errors: [{
            title: 'Invalid Attribute',
            detail: 'Please enter a valid email.'
          }]
        })
      }
    }

    const usernames = await getUsernames(email)

    if (!usernames || !usernames.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          errors: [{
            title: 'Not Found',
            detail: 'No user with that email was found.'
          }]
        })
      }
    }

    let message
    if (usernames.length) {
      message = generateForgotUsernameMessage(usernames)
    } else {
      message = generateNoUsernameMatchMessage()
    }

    await sendForgotUsernameEmail(email, message)

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
