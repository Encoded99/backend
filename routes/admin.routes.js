import { Router } from 'express'
import {
  fetchProducts,
  updateProductStatus,
} from '../controller/product.controller.js'
import { findAll, deleteUser } from '../controller/authentication.js'
import isLoggedIn from '../middleware/authentication.js'

const admin = Router()
admin.use(isLoggedIn)
admin.get('/users', findAll)
admin.get('/products', fetchProducts)
admin.patch('products/:id/status', updateProductStatus)
admin.delete('/users/:id', deleteUser)

export default admin
