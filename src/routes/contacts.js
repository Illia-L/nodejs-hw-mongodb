import { Router } from 'express';
import {
  createContactController,
  deletContactController,
  getAllContactsController,
  getContactByIdController,
} from '../controllers/contacts';
import { ctrlWrapper } from '../utils/ctrlWrapper';

const router = Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));
router.post('/contacts/', ctrlWrapper(createContactController));
router.delete('/contacts/:contactId', ctrlWrapper(deletContactController));

export default router;
