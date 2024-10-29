import createError from 'http-errors';
import Contact from '../models/contactModel.js';

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id });
    res.json({ status: 200, data: contacts });
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
    const newContact = new Contact({ ...req.body, userId: req.user._id });
    await newContact.save();
    res.status(201).json({ status: 201, message: 'Contact created successfully', data: newContact });
  } catch (error) {
    next(error);
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