const Joi = require('joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    first_name: Joi.string().min(3).required(),
    last_name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    phone_number: Joi.string().pattern(/^\+\d{1,15}$/).optional(),
    nationality: Joi.string().optional(),
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
}
  const profileUpdateValidation = (data) => {
    const schema = Joi.object({
      first_name: Joi.string().min(3).required(),
      last_name: Joi.string().min(3).required(),
      phone_number: Joi.string().pattern(/^\+\d{1,15}$/).optional(),
      gender: Joi.string().optional(),
      nationality: Joi.string().optional(),
      profile_image: Joi.string().optional()
    });
  
  return schema.validate(data);
};

module.exports = { registerValidation, loginValidation, profileUpdateValidation };  // Export the functions
