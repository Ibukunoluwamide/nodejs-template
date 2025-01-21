const Joi = require('joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().pattern(/^\+\d{1,15}$/).required(),
    password: Joi.string().min(8).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
