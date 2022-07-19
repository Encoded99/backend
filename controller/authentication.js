import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../database/models/users.js'
import Exception from '../utils/exception.js'
import { registerValidation, LoginValidation } from '../validations/register.js'
import Msg from '../utils/resMsg.js'

export async function SignUp(req, res, next) {
  try {
    const data = req.body
    const { error } = registerValidation(data)
    if (error) throw new Exception(error.details[0].message, 400)
    const isEmailExist = await User.findOne({ email: data.email })
    if (isEmailExist) throw new Exception('Email already exists', 400)
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

    if (!user) return res.status(400).json({ error: 'Email is wrong' })

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword)
      return res.status(400).json({ error: 'Incorrect Password ' })

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '120mins',
    })

    user.token = token
    const account = await User.create(user)
    res.send({
      status: 200,
      message: ' Login sucessfull ',
      data: account,
    })
  } catch (err) {
    next(err)
  }
}
