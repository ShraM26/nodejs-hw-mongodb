import express from 'express';
import { getAllContacts, getContactById, createContact, updateContact, patchContact, deleteContact } from '../controllers/contactController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { contactSchema, updateContactSchema } from '../utils/contactValidation.js';
import isValidId from '../middlewares/isValidId.js';


const router = express.Router();

// Маршрут для получения всех контактов
router.get('/', ctrlWrapper(getAllContacts));

// Маршрут для получения контакта по id
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

// Маршрут для создания нового контакта
router.post('/', validateBody(contactSchema), ctrlWrapper(createContact));

// Маршрут для часткового оновлення контакту
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(patchContact));

// Маршрут для обновления существующего контакта
router.put('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));

// Маршрут для удаления контакта
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;