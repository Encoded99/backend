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

  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  tags: [String],
  comments: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
      comment: String,
    },
  ],
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
})

const Product = mongoose.model('Product', Schema)

export default Product
