import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';

// Функція для створення нового користувача
export const createUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw createError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    return newUser;
};

// Функція для аутентифікації користувача та створення сесії
export const authenticateUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw createError(401, 'Invalid email or password');
    }

    const existingSession = await Session.findOne({ userId: user._id });
    if (existingSession) {
        await existingSession.deleteOne();
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    const newSession = await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    return { accessToken, refreshToken };
};

// Функція для оновлення сесії користувача на основі refresh токена
export const refreshUserSession = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const existingSession = await Session.findOne({ userId, refreshToken });
        if (!existingSession || new Date() > existingSession.refreshTokenValidUntil) {
            throw createError(401, 'Invalid or expired refresh token');
        }

        await existingSession.deleteOne();

        const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

        await Session.create({
            userId,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
            refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        return newAccessToken;
    } catch (error) {
        throw createError(401, 'Invalid or expired refresh token');
    }
};

// Функція для логауту користувача та видалення сесії
export const logoutUserSession = async (refreshToken) => {
    const session = await Session.findOneAndDelete({ refreshToken });

    if (!session) {
        throw createError(401, 'Session not found');
    }
};
