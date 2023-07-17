import { Router } from 'express'
import {
  signUpEmailPassword,
  signUpMagicLink,
  completeSignup,
  Login,
  updateUser,
  myAccout,
} from '../controller/authentication.js'
import isLoggedIn from '../middleware/authentication.js'

const userRouter = Router()

userRouter.post('/', signUpEmailPassword)
userRouter.post('/signup-link', signUpMagicLink)
userRouter.post('/complete-signup', completeSignup)
userRouter.post('/login', Login)
userRouter.get('/my-profile', isLoggedIn, myAccout)
userRouter.patch('/update-profile', isLoggedIn, updateUser)

export default userRouter
