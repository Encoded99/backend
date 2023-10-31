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

userRouter.use(isLoggedIn)
userRouter.get('/my-profile', myAccout)
userRouter.patch('/update-profile', updateUser)

export default userRouter
