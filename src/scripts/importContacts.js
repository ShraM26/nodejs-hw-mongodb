import mongoose from 'mongoose';
import Contact from '../models/contactModel.js';
import contacts from '../contacts.json'; 
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

async function importContacts() {
  try {
    await mongoose.connect(uri);
    
    
    await Contact.deleteMany({});
    
    
    const result = await Contact.insertMany(contacts);
    console.log(`${result.length} contacts imported successfully!`);
  } catch (error) {
    console.error('Error importing contacts:', error);
  } finally {
    mongoose.connection.close();
  }
}

importContacts();