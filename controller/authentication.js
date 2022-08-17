import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../database/models/users.js'
import Exception from '../utils/exception.js'
import { registerValidation, LoginValidation } from '../validations/register.js'
import Msg from '../utils/resMsg.js'

export async function signUp(req, res, next) {
  try {
    const data = req.body
    req.req = 'djdjdjdjd'
    const { error } = registerValidation(data)
    if (error) throw new Exception(error.details[0].message, 400)
    const isEmailExist = await User.findOne({
      $or: [{ email: data.email }, { telephone: data.telephone }],
    })
    if (isEmailExist) throw new Exception('user exist', 400)
    data.password = await bcrypt.hash(data.password, 10)
    const account = await User.create(data)
    Msg(res, { data: account }, 'registered', 201)
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
    user.accessToken = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT,
      {
        expiresIn: '120mins',
      }
    )

    return Msg(res, { data: user }, 'login successful', 200)
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}

export async function findOne(req, res, next) {
  try {
    const { id } = req.params
    const user = await User.findOne({ _id: id })
    if (!user) throw new Exception('user  not found ', 400)

    Msg(res, { data: user })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
export async function findAll(req, res, next) {
  try {
    const user = await User.find()

    Msg(res, { data: user })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
export async function updateUser(req, res, next) {
  try {
    const { id } = req.params
    const user = await User.findOne({ _id: id })
    if (!user) throw new Exception('user  not found ', 400)

    const data = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
    })

    Msg(res, { data })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
export async function searchUser(req, res, next) {
  try {
    const { country } = req.query
    console.log(req.query, 'query')

    const user = await User.findOne({ 'address.country': country })
    if (!user) throw new Exception('user  not found ', 400)

    Msg(res, { user })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
