import { Router } from 'express'
import HomePage from '../controller/homepage.js'
import upload from '../services/upload.js'
import UploadToStorage from '../controller/uploadToStorage.js'
import RequestIp from '../middleware/request-ip.js'
import {
  signUp,
  Login,
  findOne,
  findAll,
  updateUser,
  searchUser,
} from '../controller/authentication.js'

const router = Router()

// router.use(RequestIp)

router.get('/', HomePage)
router.get('/:id/user', findOne)
router.get('/users', findAll)
router.post('/user', signUp)
router.post('/login', Login)
router.patch('/:id/user', updateUser)
router.get('/search', searchUser)
router.post('/upload-media', upload.array('media', 10), UploadToStorage)

export default router
