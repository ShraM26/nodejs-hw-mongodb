import Contact from "../models/contactModel.js";

export const getAllStudents = async () => {
  const contact = await Contact.find();
  return contact;
};

export const getStudentById = async (studentId) => {
  const contact = await Contact.findById(studentId);
  return contact;
};