import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  description: {
    type: String,
    required: [true, 'description is required'],
  },
  category: {
    type: String,
    required: [true, 'category is required'],
  },
  slug: {
    type: String,
    unique: true,
    lower: true,
    required: true,
  },
  image: {
    type: String,
    required: [true, 'image is required'],
  },

  discount: {
    type: Number,
  },
  amount: {
    type: Number,
  },

  sku: {
    type: Number,
  },

  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },

  available: {
    type: Boolean,
    default: true,
  },
  tags: [String],
  reviews: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
      },
      comment: String,
    },
  ],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
})

const Product = mongoose.model('products', Schema)

export default Product
