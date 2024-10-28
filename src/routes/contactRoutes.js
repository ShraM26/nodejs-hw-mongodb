import express from 'express';
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../controllers/contactController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

// Create a new contact
router.post('/', authenticate, createContact);

// Get all contacts for the authenticated user
router.get('/', authenticate, getContacts);

// Get a contact by ID for the authenticated user
router.get('/:id', authenticate, getContactById);

// Update a contact for the authenticated user
router.put('/:id', authenticate, updateContact);

// Delete a contact for the authenticated user
router.delete('/:id', authenticate, deleteContact);

export default router;