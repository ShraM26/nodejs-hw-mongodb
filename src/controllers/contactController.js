import Contact from '../models/contactModel.js';

export const getAllContacts = async (req, res) => {
    try {
        console.log('Fetching all contacts...'); // Лог для проверки
        const contacts = await Contact.find();  // Выполняем запрос к базе данных
        console.log('Contacts found:', contacts); // Логируем найденные контакты
        
        if (contacts.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No contacts found!',
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Successfully found contacts!',
            data: contacts,  // Возвращаем данные в формате JSON
        });
    } catch (error) {
        console.error('Error fetching contacts:', error); // Логируем ошибку
        res.status(500).json({
            status: 500,
            message: 'Failed to fetch contacts',
            error: error.message,
        });
    }
};

export const getContactById = async (req, res) => {
    try {
        const { contactId } = req.params;
        const contact = await Contact.findById(contactId);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Failed to fetch contact',
            error: error.message,
        });
    }
};