import slugify from 'slugify'

import User from '../database/models/users.js'
import Exception from '../utils/exception.js'
import validateProduct from '../validations/product.validation.js'
import Msg from '../utils/resMsg.js'
import Product from '../database/models/products.js'

export async function addProduct(req, res, next) {
  try {
    const data = req.body
    const { error } = validateProduct(data)
    if (error) throw new Exception(error.details[0].message, 400)
    data.slug = slugify(`${data.name} ${Date.now()}`, {
      lower: true,
      trim: true,
    })
    const product = await Product.create(data)
    Msg(res, { data: product }, 'product added to marketplace', 201)
  } catch (error) {
    next(new Exception(error.message, error.status))
  }
}

export async function findProduct(req, res, next) {
  try {
    const { id } = req.params
    const product = await Product.findOne({
      $or: [{ _id: id }, { slug: id }],
    })
    if (!product) throw new Exception('product not found ', 401)

    Msg(res, { data: product })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
export async function fetchProducts(req, res, next) {
  try {
    const products = await Product.find()
      .populate({ path: 'provider', select: '_id email' })
      .exec()

    Msg(res, { data: products })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params
    const product = await Product.findOne({ _id: id })
    if (!product) throw new Exception('product  not found ', 400)

    const data = await Product.findByIdAndUpdate(product._id, req.body, {
      new: true,
    })

    Msg(res, { data })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
export async function searchProducts(req, res, next) {
  try {
    const { country } = req.query
    console.log(req.query, 'query')

    const products = await Product.find({
      $or: [{ category: id }, { $lt: id }],
    })
    if (!products) throw new Exception('products  not found ', 400)

    Msg(res, { products })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
