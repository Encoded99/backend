import { Router } from 'express'
import {
  fetchProducts,
  fetchSeller,
  updateProductStatus,
} from '../controller/product.controller.js'
import {
  findOne,
  findAll,
  searchUser,
  deleteUser,
} from '../controller/authentication.js'
import isLoggedIn from '../middleware/authentication.js'

const admin = Router()
admin.use(isLoggedIn)
admin.get('/users', findAll)
admin.get('/products', fetchProducts)
admin.get('/users/search', searchUser)
admin.get('/products/sellers', fetchSeller)
admin.get('/users/:id', findOne)
admin.patch('/products/:id/status', updateProductStatus)
admin.delete('/users/:id', deleteUser)

export default admin
