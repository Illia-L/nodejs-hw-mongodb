import Joi from 'joi';
// import { isValidObjectId } from 'mongoose';

// const validateUserId = (value, helper) => {
//   if (value && !isValidObjectId(value))
//     return helper.message('User id should be valid mongodb id');

//   return true;
// };

export const createContactSchema = Joi.object({
  // userId: Joi.string().custom(validateUserId).required(),
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(50),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(50),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
