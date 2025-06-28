import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const validateId = (req, _, next) => {
  const { contactId } = req.params;
  const isValidId = isValidObjectId(contactId);

  if (!isValidId) return next(createHttpError(400, 'Invalid contact id'));

  next();
};
