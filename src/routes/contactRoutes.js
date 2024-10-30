import express from 'express';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contactController.js';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../middlewares/validateBody.js';
import { contactSchema, updateContactSchema } from '../utils/contactValidation.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getContacts);
router.get('/:id', getContactById);
router.post('/', validateBody(contactSchema), createContact);
router.put('/:id', validateBody(updateContactSchema), updateContact);
router.delete('/:id', deleteContact);

export default router;