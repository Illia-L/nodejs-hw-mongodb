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
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(ctrlWrapper(getAllContactsController))
  .post(
    upload.single('photo'),
    validateBody(createContactSchema),
    ctrlWrapper(createContactController),
  );

router
  .route('/:contactId')
  .get(validateId, ctrlWrapper(getContactByIdController))
  .patch(
    validateId,
    upload.single('photo'),
    validateBody(updateContactSchema),
    ctrlWrapper(updateContactController),
  )
  .delete(validateId, ctrlWrapper(deleteContactController));

export default router;
