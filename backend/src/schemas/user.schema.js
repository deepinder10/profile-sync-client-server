const Joi = require("joi");

const getUserSchema = Joi.object({
  id: Joi.number().required(),
});

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
	createdAt: Joi.date().default(Date.now()),
});

const updateUserSchema = createUserSchema.keys({
  id: Joi.number().required(),
});

module.exports = {
  getUserSchema,
  createUserSchema,
  updateUserSchema,
};
