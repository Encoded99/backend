import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'firstName is required'],
  },
  lastName: {
    type: String,
    required: [true, 'lastName is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lower: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  address: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },

  telephone: {
    type: String,
    unique: true,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
  accessToken: {
    type: String,
  },
  role: {
    type: String,
    enum: ['client', 'provider', 'admin', 'super admin'],
    lower: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
})

const User = mongoose.model('User', Schema)

export default User
