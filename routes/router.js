import { Router } from 'express'
import HomePage from '../controller/homepage.js'
import upload from '../services/upload.js'
import UploadToStorage from '../controller/uploadToStorage.js'
import RequestIp from '../middleware/request-ip.js'
import { SignUp } from '../controller/authentication.js'

const router = Router()

// router.use(RequestIp)

router.get('/', HomePage)
router.post('/user', SignUp)
router.post('/upload-media', upload.array('media', 10), UploadToStorage)

export default router
