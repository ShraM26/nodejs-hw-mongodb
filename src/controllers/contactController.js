import Contact from '../models/contactModel.js';
import createError from 'http-errors';
import { createNewContact, updateContactById, deleteContactById } from '../services/contacts.js';
// Получение всех контактов
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        if (contacts.length === 0) {
            return res.status(404).json({ message: 'No contacts found' });
        }
        res.status(200).json({ data: contacts });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch contacts', error: error.message });
    }
};

// Получение контакта по ID

export const getContactById = async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await Contact.findById(contactId);

        if (!contact) {
            throw createError(404, 'Contact not found');
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    } catch (error) {
        next(error);
    }
};
// Создание нового контакта
export const createContact = async (req, res, next) => {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    if (!name || !phoneNumber || !contactType) {
        throw createError(400, 'Missing required fields: name, phoneNumber, or contactType');
    }

    const newContact = await createNewContact({ name, phoneNumber, email, isFavourite, contactType });

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: newContact,
    });
};
// Обновление существующего контакта
export const updateContact = async (req, res, next) => {
    const { contactId } = req.params;
    const updateData = req.body;

    const updatedContact = await updateContactById(contactId, updateData);

    if (!updatedContact) {
        throw createError(404, 'Contact not found');
    }

    res.status(200).json({
        status: 200,
        message: "Successfully patched a contact!",
        data: updatedContact,
    });
};

// Удаление контакта
export const deleteContact = async (req, res, next) => {
    const { contactId } = req.params;

    const deletedContact = await deleteContactById(contactId);

    if (!deletedContact) {
        throw createError(404, 'Contact not found');
    }

    res.status(204).send();
};