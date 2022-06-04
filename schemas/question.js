const Joi = require('joi')

const author = {
  author: Joi.string().min(1).required()
}

const questionSchema = Joi.object({
  ...author,
  summary: Joi.string().min(1).required().pattern(/[?]$/),
  answers: Joi.array()
    .optional()
    .items(
      Joi.object({
        ...author,
        summary: Joi.string().min(1).required()
      })
    )
})

module.exports = questionSchema
