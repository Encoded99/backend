import { Router } from 'express'
import {
  addProduct,
  fetchProducts,
  findProduct,
  searchProducts,
  updateProduct,
  fetchVerifiedProducts,
  updateProductStatus,
  addProductReview,
} from '../controller/product.controller.js'
import isLoggedIn from '../middleware/authentication.js'

const pRouter = Router()
pRouter.post('/', isLoggedIn, addProduct)
pRouter.get('/', isLoggedIn, fetchProducts)
pRouter.get('/verified', fetchVerifiedProducts)
pRouter.get('/search', searchProducts)
pRouter.get('/:id', findProduct)
pRouter.patch('/:id', isLoggedIn, updateProduct)
pRouter.patch('/:id/status', isLoggedIn, updateProductStatus)
pRouter.patch('/:id/add-review', isLoggedIn, addProductReview)

export default pRouter
