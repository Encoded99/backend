import { Router } from 'express'
import {
  signUpEmailPassword,
  signUpMagicLink,
  completeSignup,
  Login,
  findOne,
  findAll,
  updateUser,
  searchUser,
  deleteUser,
} from '../../controller/authentication.js'

const userRouter = Router()

userRouter.post('/register', signUpEmailPassword)
userRouter.post('/signup-link', signUpMagicLink)
userRouter.post('/complete-signup', completeSignup)
userRouter.post('/login', Login)
userRouter.get('/users', findAll)
userRouter.get('/search', searchUser)
userRouter.patch('/:id/update', updateUser)
userRouter.get('/:id/find', findOne)
userRouter.delete('/:id/delete', deleteUser)

export default userRouter
