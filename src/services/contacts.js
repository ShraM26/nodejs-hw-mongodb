import Contact from '../models/contactModel.js';

export const createNewContact = async (contactData) => {
    
    const newContact = await Contact.create(contactData);
    return newContact;
};

export const updateContactById = async (contactId, updateData) => {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
    return updatedContact;
};

export const deleteContactById = async (contactId) => {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    return deletedContact;
};