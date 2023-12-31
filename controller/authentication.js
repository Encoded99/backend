import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../database/models/users.js'
import Auth from '../database/models/auth.js'
import Conn from '../database/config.js'
import Exception from '../utils/exception.js'
import {
  registerValidation,
  LoginValidation,
  EmailValidation,
} from '../validations/register.js'
import Msg from '../utils/resMsg.js'
import sendEmail from '../services/mail.service.js'
import generateString from '../utils/randString.js'
import { getCache, setCache } from '../utils/redisCache.js'

export async function signUpEmailPassword(req, res, next) {
  const conn = await Conn
  const session = await conn.startSession()
  try {
    session.startTransaction()
    const data = req.body
    const { error } = registerValidation(data)
    if (error) throw new Exception(error.details[0].message, 400)
    const isEmailExist = await User.findOne({
      $or: [{ email: data.email }, { telephone: data.telephone }],
    })
    if (isEmailExist) throw new Exception('user exist', 400)

    // const password = data.password = await bcrypt.hash(data.password, 10)
    const { password } = data
    delete data.password
    const account = await User.create([{ ...data }], { session })
    await Auth.create([{ user: account[0]._id, secret: password }], {
      session,
    })

    await session.commitTransaction()

    account.accessToken = jwt.sign(
      { _id: account[0]._id, email: account[0].email, role: account[0].role },
      process.env.JWT_SECRET,
      {
        expiresIn: '24hrs',
      }
    )
    Msg(res, { user: account[0] }, 'registered', 201)
  } catch (error) {
    await session.abortTransaction()
    next(new Exception(error.message, error.status))
  }
  session.endSession()
}

export async function completeSignup(req, res, next) {
  const conn = await Conn
  const session = await conn.startSession()
  try {
    session.startTransaction()
    const data = req.body
    const { token } = req.query

    const { error } = registerValidation(data)
    if (error) throw new Exception(error.details[0].message, 400)
    const cacheData = await getCache(token)
    console.log(cacheData)
    if (!cacheData || cacheData.email !== data.email)
      throw new Exception('user does not exit', 400)
    const isEmailExist = await User.findOne({
      $or: [{ email: data.email }, { telephone: data.telephone }],
    })
    if (isEmailExist) throw new Exception('user exist', 400)
    const { password } = data
    delete data.password
    const account = await User.create([{ ...data }], { session })
    await Auth.create([{ user: account[0]._id, secret: password }], {
      session,
    })

    await session.commitTransaction()

    account.accessToken = jwt.sign(
      { _id: account[0]._id, email: account[0].email, role: account[0].role },
      process.env.JWT_SECRET,
      {
        expiresIn: '24hrs',
      }
    )

    Msg(res, { user: account[0] }, 'registered', 201)
  } catch (error) {
    await session.abortTransaction()
    next(new Exception(error.message, error.status))
  }
  session.endSession()
}

export async function signUpMagicLink(req, res, next) {
  try {
    const data = req.body
    const { error } = EmailValidation(data)
    if (error) throw new Exception(error.details[0].message, 400)
    const isEmailExist = await User.findOne({ email: data.email })
    if (isEmailExist) throw new Exception('user exist', 400)
    const token = generateString()

    const body = {
      from: '"pma" <signup@pma.com>',
      email: data.email,
      subject: 'Email Verification',
      text: `<p>Click on the link below to verify your email </p>
                <a href=${token}>verify Email</a>
                `,
      html: `<p>Click on the link below to verify your email </p>
                <a href=${token}>verify Email</a>
                `,
      response: 'verification code has been sent to your email address',
    }
    const cache = await setCache(token, { token, email: data.email }, 900)
    sendEmail(body)

    Msg(
      res,
      { message: 'check your email for verification link' },
      'registered',
      201
    )
  } catch (error) {
    next(new Exception(error.message, error.status))
  }
}

export async function Login(req, res, next) {
  try {
    /* To implement later
    1. Get the user's ip address from request.
    2. Get the region where the user is browsing from using https://ipwho.is/41.217.100.157 or  https://ipwhois.app/json/41.217.100.157
    3. save the data somewhere where you can reference to return products from that region to the user when he/she uses the findAll products endpoint

    */

    const { error } = LoginValidation(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new Exception('Invalid email/password ', 401)
    const auth = await Auth.findOne({ user: user._id })

    if (!auth) throw new Exception('Invalid password/password ', 401)
    const validPassword = await bcrypt.compare(password, auth.secret)
    if (!validPassword) throw new Exception('Invalid email/password ', 401)

    user.accessToken = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '24hrs',
      }
    )

    return Msg(res, { user }, 'login successful', 200)
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}

export async function myAccout(req, res, next) {
  try {
    const userId = req.user._id
    const user = await User.findOne({ _id: userId })
    if (!user) throw new Exception('user  not found ', 400)

    Msg(res, { data: user })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}

export async function findOne(req, res, next) {
  try {
    const { id } = req.params
    const user = await User.findOne({ _id: id })
    if (!user) throw new Exception('user  not found ', 400)

    Msg(res, { user })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}

export async function findAll(req, res, next) {
  try {
    const users = await User.find().select(
      'firstName lastName email telephone role isVerified address'
    )

    Msg(res, { users })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
export async function updateUser(req, res, next) {
  try {
    const userId = req.user._id
    const user = await User.findOne({ _id: userId })
    if (!user) throw new Exception('user  not found ', 400)

    const data = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
    })

    Msg(res, { user: data })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}

export async function deleteUser(req, res, next) {
  try {
    const data = await User.findOneAndDelete({ _id: req.params.id })

    Msg(res, { data: 'user deleted' })
  } catch (err) {
    next(new Exception(err.message, err.status || 400))
  }
}
export async function searchUser(req, res, next) {
  try {
    const { email, telephone } = req.query

    const user = await User.findOne({
      $or: [{ email }, { telephone }],
    })
    if (!user) throw new Exception('user  not found ', 400)

    Msg(res, { user })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
