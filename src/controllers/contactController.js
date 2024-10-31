import createError from 'http-errors';
import {
  getAllContacts,
  getContactId,
  createNewContact,
  updateContactById,
  deleteContactById,
} from '../services/contacts.js';

export const getContacts = async (req, res, next) => {
  try {
    const contactsData = await getAllContacts(req.user._id, req.query);

    res.json({
      status: 200,
      data: contactsData.contacts,
      totalContacts: contactsData.totalItems,
      currentPage: contactsData.pageNumber,
      limit: contactsData.itemsPerPage,
      hasNextPage: contactsData.pageNumber < Math.ceil(contactsData.totalItems / contactsData.itemsPerPage),
      hasPreviousPage: contactsData.pageNumber > 1,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const contact = await getContactId(req.user._id, req.params.id);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    res.json({ status: 200, data: contact });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await createNewContact({ ...req.body, userId: req.user._id });
    res.status(201).json({ status: 201, message: 'Contact created successfully', data: newContact });
  } catch (error) {
    if (error.code === 11000) {  // Код помилки для дублювання
      next(createError(400, 'Contact with this email already exists'));
    } else {
      next(error);
    }
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const updatedContact = await updateContactById(req.user._id, req.params.id, req.body);
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }
    res.json({ status: 200, message: 'Contact updated successfully', data: updatedContact });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const deletedContact = await deleteContactById(req.user._id, req.params.id);
    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({ status: 200, message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const patchContact = async (req, res, next) => {
  try {
    const updatedContact = await updateContactById(req.user._id, req.params.id, req.body);
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }
    res.json({ status: 200, message: 'Contact updated successfully', data: updatedContact });
  } catch (error) {
    next(error);
  }
};