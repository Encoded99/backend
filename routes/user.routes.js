import { Router } from 'express'
import {
  signUpEmailPassword,
  signUpMagicLink,
  completeSignup,
  Login,
  findOne,
  updateUser,
  searchUser,
  deleteUser,
} from '../controller/authentication.js'

const userRouter = Router()

userRouter.post('/', signUpEmailPassword)
userRouter.post('/signup-link', signUpMagicLink)
userRouter.post('/complete-signup', completeSignup)
userRouter.post('/login', Login)
userRouter.get('/search', searchUser)
userRouter.patch('/:id', updateUser)
userRouter.get('/:id', findOne)

export default userRouter
