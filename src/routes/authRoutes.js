import express from 'express';
import { registerUser, loginUser, refreshSession, logoutUser } from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { userLoginSchema, userRegistrationSchema } from '../utils/userValidation.js';

const router = express.Router();

// Роут для реєстрації нового користувача
router.post('/register', validateBody(userRegistrationSchema), registerUser);

// Роут для логіну користувача
router.post('/login', validateBody(userLoginSchema), loginUser);

// Роут для оновлення сесії користувача на основі refresh токена
router.post('/refresh', refreshSession);

// Роут для логауту користувача
router.post('/logout', logoutUser);

export default router;
