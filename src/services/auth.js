import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';

export const createUser = async (userData) => {
  const newUser = await User.create(userData);
  return newUser;
};
// Функція для створення сесії
export const createSession = async (sessionData) => {
  const newSession = await Session.create(sessionData);
  return newSession;
};

// Функція для видалення старої сесії
export const deleteSession = async (userId) => {
  await Session.findOneAndDelete({ userId });
};

// Функція для видалення сесії за refresh токеном
export const deleteSessionByRefreshToken = async (refreshToken) => {
  await Session.findOneAndDelete({ refreshToken });
};

// Функція для видалення сесії за ID рефреш токена
export const deleteSessionById = async (refreshToken) => {
  const deletedSession = await Session.findOneAndDelete({ refreshToken });
  return deletedSession;
};