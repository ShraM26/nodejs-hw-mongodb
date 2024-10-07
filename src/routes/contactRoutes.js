import express from 'express';
import { getAllContacts } from '../controllers/contactController.js';
import { getContactById } from '../controllers/contactController.js';

const router = express.Router();

router.get('/', getAllContacts);
router.get('/:contactId', getContactById);

export default router;