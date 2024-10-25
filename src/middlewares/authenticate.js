import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/userModel.js';

const { ACCESS_SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    // Перевірка, чи заголовок містить Bearer токен
    if (bearer !== 'Bearer' || !token) {
      throw createError(401, 'Authorization token is missing');
    }

    // Перевірка валідності токену
    const { id } = jwt.verify(token, ACCESS_SECRET_KEY);
    const user = await User.findById(id);

    // Якщо користувач не знайдений
    if (!user) {
      throw createError(401, 'User not found');
    }

    // Додаємо користувача до запиту
    req.user = user;
    next();
  } catch (error) {
    // Перевірка на протермінування токену
    if (error.name === 'TokenExpiredError') {
      next(createError(401, 'Access token expired'));
    } else {
      next(createError(401, 'Invalid access token'));
    }
  }
};

export default authenticate;