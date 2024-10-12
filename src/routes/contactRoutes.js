import express from 'express';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../controllers/contactController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

// Маршрут для получения всех контактов
router.get('/', ctrlWrapper( getAllContacts));

// Маршрут для получения контакта по id
router.get('/:contactId', ctrlWrapper( getContactById));

// Маршрут для создания нового контакта
router.post('/', ctrlWrapper( createContact));

// Маршрут для обновления существующего контакта
router.put('/:contactId', ctrlWrapper( updateContact));

// Маршрут для удаления контакта
router.delete('/:contactId', ctrlWrapper( deleteContact));

export default router;