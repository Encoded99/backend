import * as nodemailer from 'nodemailer'
// import * as Sentry from '@sentry/node'
import Exception from '../utils/exception.js'
import logger from '../utils/logger.js'

export default async function sendEmail(body) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  let result
  try {
    const { from, email, subject, text, html, response = '' } = body
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
    transporter.verify((error, success) => {
      if (error) {
        logger.error({
          message: error.message,
          data: error,
          func: 'sendEmail',
          time: new Date(),
        })

        result = error.message
      }
      return result
    })
    result = await transporter.sendMail({
      from,
      to: email,
      subject,
      text,
      html,
    })
    logger.log(result, 'response from mail')
    return response
  } catch (error) {
    throw new new Exception(error.message, error.status || 400)()
  }
}
