import { Router } from 'express'
import HomePage from '../controller/homepage.js'
import RequestIp from '../middleware/request-ip.js'

import userRouter from './users/user.routes.js'
import pRouter from './users/product.router.js'

const router = Router()

// router.use(RequestIp)

router.get('/', HomePage)
router.use('/users', userRouter)
router.use('/products', pRouter)

export default router
