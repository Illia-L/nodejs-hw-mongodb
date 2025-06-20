import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEasily: false });

    next();
  } catch (err) {
    const validationError = createHttpError(400, 'Bad request', {
      errors: err.details,
    });

    next(validationError);
  }
};
