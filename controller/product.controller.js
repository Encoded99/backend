import slugify from 'slugify'
import User from '../database/models/users.js'
import Exception from '../utils/exception.js'
import validateProduct from '../validations/product.validation.js'
import Msg from '../utils/resMsg.js'
import Product from '../database/models/products.js'
import Review from '../database/models/reviews.js'

export async function addProduct(req, res, next) {
  try {
    const data = req.body
    const { error } = validateProduct(data)
    if (error) throw new Exception(error.details[0].message, 400)
    data.slug = slugify(`${data.name} ${Date.now()}`, {
      lower: true,
      trim: true,
    })
    data.seller = req.user._id
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
      .populate([
        {
          path: 'seller',
          select: '_id email telephone, address reviews',
        },
        {
          path: 'reviews',
          select: 'review',
          populate: { path: 'user', select: 'firstName email _id' },
        },
      ])
      .exec()
    if (!product) throw new Exception('product not found ', 400)

    Msg(res, { data: product })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
export async function fetchProducts(req, res, next) {
  try {
    if (req.user.role !== 'admin') {
      throw new Exception(
        "you don't have the privilege to perform the action",
        400
      )
    }
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'seller',
        select: '_id email telephone, address reviews',
      })
      .populate([
        {
          path: 'reviews',
          select: 'review',
          populate: { path: 'user', select: 'firstName email _id' },
        },
      ])
      .exec()

    Msg(res, { data: products })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}

export async function fetchVerifiedProducts(req, res, next) {
  try {
    const products = await Product.find({ status: 'verified' })
      .sort({ createdAt: -1 })
      .populate({
        path: 'seller',
        select: '_id email telephone, address reviews',
      })
      .populate([
        {
          path: 'reviews',
          select: 'review',
          populate: { path: 'user', select: 'firstName email _id' },
        },
      ])
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

export async function updateProductStatus(req, res, next) {
  try {
    const { id } = req.params
    const product = await Product.findOne({ _id: id })
    if (!product) throw new Exception('product  not found ', 400)

    product.status = req.body.status

    const data = await Product.findByIdAndUpdate(product._id, product, {
      new: true,
    })

    Msg(res, { data })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}
export async function searchProducts(req, res, next) {
  try {
    const { tag, category, name, amount } = req.query

    const products = await Product.find({
      $or: [
        { tags: { $regex: `.*${name}.*`, $options: 'i' } },
        { name: { $regex: `.*${tag}.*`, $options: 'i' } },
        { tags: { $in: [tag] } },
        { amount: { $lt: amount } },
        { category: { $regex: `.*${category}.*`, $options: 'i' } },
      ],
    }).limit(10)
    if (!products) throw new Exception('products  not found ', 400)

    Msg(res, { products })
  } catch (err) {
    next(new Exception(err.message, err.status))
  }
}

export async function addProductReview(req, res, next) {
  try {
    const { id } = req.params
    const product = await Product.findOne({ _id: id })
    if (!product) throw new Exception('product  not found ', 400)

    const review = await Review.create({
      review: req.body.review,
      user: req.user._id,
      product: product._id,
    })

    product.reviews.push(review)

    const data = await Product.findByIdAndUpdate(product._id, product, {
      new: true,
    })
    Msg(res, { data }, 'review added to product ', 201)
  } catch (error) {
    next(new Exception(error.message, error.status))
  }
}
