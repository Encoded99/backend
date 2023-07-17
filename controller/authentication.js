import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../database/models/users.js'
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
  try {
    const data = req.body
    const { error } = registerValidation(data)
    if (error) throw new Exception(error.details[0].message, 400)
    const isEmailExist = await User.findOne({
      $or: [{ email: data.email }, { telephone: data.telephone }],
    })
    if (isEmailExist) throw new Exception('user exist', 400)
    data.password = await bcrypt.hash(data.password, 10)
    const account = await User.create(data)

    account.accessToken = jwt.sign(
      { _id: account._id, email: account.email, role: account.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '24hrs',
      }
    )
    account.password = null
    Msg(res, { user: account }, 'registered', 201)
  } catch (error) {
    next(new Exception(error.message, error.status))
  }
}

export async function completeSignup(req, res, next) {
  try {
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
    data.password = await bcrypt.hash(data.password, 10)
    const account = await User.create(data)
    delete account.password
    account.accessToken = jwt.sign(
      { _id: account._id, email: account.email, role: account.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '24hrs',
      }
    )
    Msg(res, { user: account }, 'registered', 201)
  } catch (error) {
    next(new Exception(error.message, error.status))
  }
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
    const { error } = LoginValidation(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) throw new Exception('Invalid email/password ', 401)

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) throw new Exception('Invalid email/password ', 401)
    user.password = null
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
    user.password = null

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
    user.password = null

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

    data.password = null
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
    user.password = null

    Msg(res, { user })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
