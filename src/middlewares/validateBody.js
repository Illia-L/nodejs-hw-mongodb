import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, _, next) => {
  try {
    console.log({body:req.body});
    await schema.validateAsync(req.body, { abortEasily: false });

    next();
  } catch (err) {
    const validationError = createHttpError(400, 'Bad request', {
      errors: err.details,
    });

    next(validationError);
  }
};
