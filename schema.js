const Joi = require("joi");

const userSignUpValidationSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "any.required": "First name is required.",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Last name is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
  dob: Joi.date().max("now").required().messages({
    "date.max": "Date of birth cannot be in the future.",
    "any.required": "Date of birth is required.",
  }),
  gender: Joi.string().valid("Male", "Female", "Other").required().messages({
    "any.only": "Gender must be either Male, Female, or Other.",
    "any.required": "Gender is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
  confirmPassword: Joi.string().required().messages({
    "any.required": "Confirm password is required.",
  }),
  avatar: Joi.string().uri().optional().messages({
    "string.uri": "Avatar must be a valid URL.",
  }),
});

const userLoginValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required!",
  }),
});

module.exports = { userSignUpValidationSchema, userLoginValidationSchema };
