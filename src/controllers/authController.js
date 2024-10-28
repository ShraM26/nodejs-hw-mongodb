import createError from 'http-errors';
import { createUser, authenticateUser, refreshUserSession, logoutUserSession } from '../services/auth.js';

// Контролер для реєстрації нового користувача
export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await createUser({ name, email, password });
        
        res.status(201).json({
            status: 201,
            message: "Successfully registered a user!",
            data: { _id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        next(error);
    }
};

// Контролер для логіну користувача
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await authenticateUser({ email, password });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 днів
        });

        res.status(200).json({
            status: 200,
            message: "Successfully logged in an user!",
            data: { accessToken }
        });
    } catch (error) {
        next(error);
    }
};

// Контролер для оновлення сесії користувача на основі refresh токена
export const refreshSession = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            throw createError(401, 'Refresh token is missing');
        }

        const newAccessToken = await refreshUserSession(refreshToken);

        res.status(200).json({
            status: 200,
            message: "Successfully refreshed a session!",
            data: { accessToken: newAccessToken }
        });
    } catch (error) {
        next(error);
    }
};

// Контролер для логауту користувача
export const logoutUser = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            throw createError(401, 'Refresh token is missing');
        }

        await logoutUserSession(refreshToken);

        res.clearCookie('refreshToken');
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
