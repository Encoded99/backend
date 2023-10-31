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
  generateAndSendInvoice,
  userDeleteProduct,
} from '../controller/product.controller.js'
import isLoggedIn from '../middleware/authentication.js'

const pRouter = Router()
pRouter.post('/', isLoggedIn, addProduct)
pRouter.get('/verified', fetchVerifiedProducts)
pRouter.get('/search', searchProducts)
pRouter.get('/invoice', generateAndSendInvoice)
pRouter.get('/:id', findProduct)

pRouter.use(isLoggedIn)
pRouter.patch('/:id', updateProduct)
pRouter.patch('/:id/status', updateProductStatus)
pRouter.patch('/:id/add-review', addProductReview)
pRouter.delete('/:id', userDeleteProduct)

export default pRouter
