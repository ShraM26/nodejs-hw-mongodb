import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../utils/authValidation.js';
import { register, login, refresh, logout } from '../controllers/auth.js';

const router = express.Router();

// Маршрут для реєстрації нового користувача
router.post('/register', validateBody(registerSchema), ctrlWrapper(register));

// Маршрут для логіну користувача
router.post('/login', validateBody(loginSchema), ctrlWrapper(login));

// Маршрут для оновлення сесії
router.post('/refresh', ctrlWrapper(refresh));

// Маршрут для логауту користувача
router.post('/logout', ctrlWrapper(logout));

export default router;