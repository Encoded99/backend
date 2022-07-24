import Joi from 'joi'

// validate users info
export const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(255).required(),
    lastName: Joi.string().min(3).max(255).required(),
    telephone: Joi.string().min(11).max(14).required(),
    role: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(1024).required(),
    address: Joi.object({
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
    }),
  })
  return schema.validate(data)
}
// validate login details info
export const LoginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  })
  return schema.validate(data)
}