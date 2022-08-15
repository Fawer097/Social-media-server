import joi from 'joi';

export const userDataValidation = (data) => {
  const schema = joi.object({
    firstName: joi.string().min(2).max(28).required(),
    lastName: joi.string().min(2).max(28).required(),
    dateOfBirth: joi.required(),
    gender: joi.required(),
    email: joi.string().email().required(),
    createPassword: joi.string().min(6).max(128).required(),
    confirmPassword: joi.string().min(6).max(128).required(),
  });

  return schema.validate(data);
};
