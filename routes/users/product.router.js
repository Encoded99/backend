import { Router } from 'express'
import {
  addProduct,
  fetchProducts,
  findProduct,
  searchProducts,
  updateProduct,
} from '../../controller/product.controller.js'

const pRouter = Router()
pRouter.post('/add', addProduct)
pRouter.get('/products', fetchProducts)
pRouter.get('/search', searchProducts)
pRouter.patch('/:id/update', updateProduct)
pRouter.get('/:id/find', findProduct)

export default pRouter
