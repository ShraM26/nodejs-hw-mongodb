import Contact from '../models/contactModel.js';


// Отримання всіх контактів
export const getAllContacts = async (userId, query) => {
    const { page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite } = query;
    const pageNumber = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(perPage, 10) || 10;
    const skip = (pageNumber - 1) * itemsPerPage;

    const order = sortOrder === 'desc' ? -1 : 1;
    const sortOptions = { [sortBy]: order };

    const filterOptions = { userId }; // Додаємо фільтр по userId
    if (type) filterOptions.contactType = type;
    if (isFavourite !== undefined) filterOptions.isFavourite = isFavourite === 'true';

    const totalItems = await Contact.countDocuments(filterOptions);
    const contacts = await Contact.find(filterOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .sort(sortOptions);

    return { contacts, totalItems, pageNumber, itemsPerPage };
};

// Отримання контакту користувача за ID
export const getContactById = async (userId, contactId) => {
    return await Contact.findOne({ _id: contactId, userId }); // Шукаємо по _id і userId
};

// Створення нового контакту
export const createNewContact = async (contactData) => {
    const newContact = new Contact(contactData);
    return await newContact.save();
};

// Оновлення контакту користувача за ID
export const updateContactById = async (userId, contactId, updateData) => {
    return await Contact.findOneAndUpdate(
        { _id: contactId, userId }, // Перевірка по userId
        updateData,
        { new: true, runValidators: true } // Додаємо валідацію при оновленні
    );
};

// Видалення контакту користувача за ID
export const deleteContactById = async (userId, contactId) => {
    return await Contact.findOneAndDelete({ _id: contactId, userId }); // Перевірка по userId
};