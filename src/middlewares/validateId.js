import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const validateId = (req, _, next) => {
  const { contactId } = req.params;
  const isValidId = isValidObjectId(contactId);

  if (!isValidId) throw createHttpError(400, 'Invalid contact id');

  next();
};
