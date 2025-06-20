import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateId } from '../middlewares/validateId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';

const router = Router();

router
  .route('/contacts')
  .get(ctrlWrapper(getAllContactsController))
  .post(
    validateBody(createContactSchema),
    ctrlWrapper(createContactController),
  );

router
  .route('/contacts/:contactId')
  .get(validateId, ctrlWrapper(getContactByIdController))
  .patch(
    validateId,
    validateBody(updateContactSchema),
    ctrlWrapper(updateContactController),
  )
  .delete(validateId, ctrlWrapper(deleteContactController));

export default router;
