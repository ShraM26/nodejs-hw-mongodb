import createError from 'http-errors';
import { createNewContact } from '../services/contacts.js';
import Contact from '../models/contactModel.js';

export const getContacts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const contacts = await Contact.find({ userId: req.user._id })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalContacts = await Contact.countDocuments({ userId: req.user._id });
    const totalPages = Math.ceil(totalContacts / limit);

    res.json({
      status: 200,
      data: contacts,
      pagination: {
        totalContacts,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, userId: req.user._id });
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
    if (error.code === 11000) {  // 11000 - код помилки для дублювання
      next(createError(400, 'Contact with this email already exists'));
    } else {
      next(error);
    }
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
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
    const deletedContact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({ status: 200, message: 'Contact deleted successfully' });
  } catch (error) {
    next(error);
  }
};