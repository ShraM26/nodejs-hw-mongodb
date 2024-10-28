
import createError from 'http-errors';
import { 
    createNewContact, 
    getAllContacts as fetchAllContacts, 
    getContactById as fetchContactById, 
    updateContactById as modifyContactById, 
    deleteContactById as removeContactById 
} from '../services/contacts.js';

// Отримання всіх контактів
export const getAllContacts = async (req, res, next) => {
    const userId = req.user._id; // Отримуємо userId з токена
    const query = req.query; // Отримуємо параметри запиту

    try {
        const { contacts, totalItems, pageNumber, itemsPerPage } = await fetchAllContacts(userId, query);
        res.status(200).json({
            status: 200,
            message: 'Contacts retrieved successfully',
            data: { contacts, totalItems, pageNumber, itemsPerPage },
        });
    } catch (error) {
        next(error);
    }
};

// Отримання контакту користувача за ID
export const getContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user._id;

    try {
        const contact = await fetchContactById(userId, contactId);
        if (!contact) {
            return next(createError(404, 'Contact not found'));
        }
        res.status(200).json({
            status: 200,
            message: 'Contact retrieved successfully',
            data: contact,
        });
    } catch (error) {
        next(error);
    }
};

// Створення нового контакту
export const createContact = async (req, res, next) => {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    // Перевіряємо обов'язкові поля
    if (!name || !phoneNumber || !contactType) {
        throw createError(400, 'Missing required fields: name, phoneNumber, or contactType');
    }

    // Додаємо поле userId із req.user._id
    try {
        const newContact = await createNewContact({ 
            name, 
            phoneNumber, 
            email, 
            isFavourite, 
            contactType, 
            userId: req.user._id // Додаємо userId
        });

        res.status(201).json({
            status: 201,
            message: "Successfully created a contact!",
            data: newContact,
        });
    } catch (error) {
        next(error);
    }
};

// Оновлення контакту користувача за ID
export const patchContact = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    try {
        const updatedContact = await modifyContactById(userId, contactId, updateData);
        if (!updatedContact) {
            return next(createError(404, 'Contact not found'));
        }

        res.status(200).json({
            status: 200,
            message: "Contact updated successfully",
            data: updatedContact,
        });
    } catch (error) {
        next(error);
    }
};

// Видалення контакту користувача за ID
export const deleteContact = async (req, res, next) => {
    const { contactId } = req.params;
    const userId = req.user._id;

    try {
        const deletedContact = await removeContactById(userId, contactId);
        if (!deletedContact) {
            return next(createError(404, 'Contact not found'));
        }

        res.status(204).send(); // Відповідь без тіла для успішного видалення
    } catch (error) {
        next(error);
    }
};
