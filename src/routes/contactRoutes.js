import express from 'express';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  patchContact, 
} from '../controllers/contactController.js';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../middlewares/validateBody.js';
import { contactSchema, updateContactSchema } from '../utils/contactValidation.js';

const router = express.Router();

router.use(authenticate);

// Отримання всіх контактів
router.get('/', getContacts);

// Отримання контакту за ID
router.get('/:id', getContactById);

// Створення нового контакту
router.post('/', validateBody(contactSchema), createContact);

// Оновлення контакту (повне оновлення)
router.put('/:id', validateBody(updateContactSchema), updateContact);

// Часткове оновлення контакту
router.patch('/:id', validateBody(updateContactSchema), patchContact);  // Додали маршрут для PATCH

// Видалення контакту
router.delete('/:id', deleteContact);

export default router;