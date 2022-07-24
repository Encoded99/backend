import { Router } from 'express'
import {
  signUp,
  Login,
  findOne,
  findAll,
  updateUser,
  searchUser,
} from '../../controller/authentication.js'

const userRouter = Router()

userRouter.post('/register', signUp)
userRouter.post('/login', Login)
userRouter.get('/users', findAll)
userRouter.get('/search', searchUser)
userRouter.patch('/:id/update', updateUser)
userRouter.get('/:id/find', findOne)

export default userRouter
