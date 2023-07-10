import { Router } from 'express'
import {
  addProduct,
  fetchProducts,
  findProduct,
  searchProducts,
  updateProduct,
  fetchVerifiedProducts,
  updateProductStatus,
} from '../../controller/product.controller.js'
import isLoggedIn from '../../middleware/authentication.js'

const pRouter = Router()
pRouter.post('/', isLoggedIn, addProduct)
pRouter.get('/', isLoggedIn, fetchProducts)
pRouter.get('/verified', fetchVerifiedProducts)
pRouter.get('/search', searchProducts)
pRouter.get('/:id', findProduct)
pRouter.patch('/:id', isLoggedIn, updateProduct)
pRouter.patch('/:id/status', isLoggedIn, updateProductStatus)

export default pRouter
