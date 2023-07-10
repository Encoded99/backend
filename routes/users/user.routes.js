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

userRouter.post('/', signUpEmailPassword)
userRouter.post('/signup-link', signUpMagicLink)
userRouter.post('/complete-signup', completeSignup)
userRouter.post('/login', Login)
userRouter.get('/', findAll)
userRouter.get('/search', searchUser)
userRouter.patch('/:id', updateUser)
userRouter.get('/:id', findOne)
userRouter.delete('/:id', deleteUser)

export default userRouter
