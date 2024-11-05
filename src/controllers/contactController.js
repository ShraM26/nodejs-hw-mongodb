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
      data: contactsData.contacts.map(contact => ({
        ...contact.toObject(),
        photo: contact.photo || null,  // Перевірка наявності фото
      })),
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
    res.json({ status: 200, data: { ...contact.toObject(), photo: contact.photo || null } });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const photo = req.file ? req.file.path : null;
    const newContact = await createNewContact({ ...req.body, userId: req.user._id, photo });
    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: { ...newContact.toObject(), photo: newContact.photo || null },
    });
  } catch (error) {
    if (error.code === 11000) {
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
    const photo = req.file ? req.file.path : undefined;
    const updatedData = photo ? { ...req.body, photo } : req.body;
    const updatedContact = await updateContactById(req.user._id, req.params.id, updatedData);
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }
    res.json({
      status: 200,
      message: 'Contact updated successfully',
      data: { ...updatedContact.toObject(), photo: updatedContact.photo || null },
    });
  } catch (error) {
    next(error);
  }
};