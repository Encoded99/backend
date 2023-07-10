import Joi from 'joi'

const validateProduct = (data) => {
  const Schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    image: Joi.string().required(),
    sku: Joi.number().required(),
    amount: Joi.number().required(),
    discount: Joi.number().optional(),
    tags: Joi.array().required(),
  })
  return Schema.validate(data)
}
export default validateProduct
