import createError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createSession, deleteSession, deleteSessionById,  createUser} from '../services/auth.js';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Перевіряємо, чи існує вже користувач з такою ж поштою
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'Email in use');
    }

    // Хешуємо пароль перед збереженням
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створюємо нового користувача
    const newUser = await createUser({ name, email, password: hashedPassword });

    // Видаляємо пароль перед відправкою відповіді
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Перевіряємо, чи існує користувач з такою поштою
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(401, 'Invalid email or password');
    }

    // Перевіряємо правильність пароля
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw createError(401, 'Invalid email or password');
    }

    // Видаляємо стару сесію, якщо вона існує
    await deleteSession(user._id);

    // Генеруємо access та refresh токени
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Створюємо нову сесію
    const session = await createSession({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    // Записуємо refresh токен у cookies
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.status(200).json({
      status: 200,
      message: "Successfully logged in an user!",
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createError(401, 'Refresh token is missing');
    }

    // Перевіряємо валідність рефреш токена
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      throw createError(401, 'Invalid refresh token');
    }

    // Знайдемо сесію за рефреш токеном
    const existingSession = await Session.findOne({ refreshToken });
    if (!existingSession) {
      throw createError(401, 'Session not found or expired');
    }

    // Видаляємо стару сесію
    await deleteSession(existingSession.userId);

    // Генеруємо нові access та refresh токени
    const newAccessToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Створюємо нову сесію
    const newSession = await createSession({
      userId: payload.userId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Оновлюємо рефреш токен у cookies
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

    res.status(200).json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw createError(401, 'Refresh token is missing');
    }

    // Видаляємо сесію за рефреш токеном
    const result = await deleteSessionById(refreshToken);
    if (!result) {
      throw createError(404, 'Session not found');
    }

    // Очищуємо cookies
    res.clearCookie('refreshToken');

    // Відповідаємо статусом 204 без тіла відповіді
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};