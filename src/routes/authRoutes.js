import express from 'express';
import { register, login, refresh, logout } from '../controllers/authController.js';
import validateBody from '../middlewares/validateBody.js';
import { userSchema, loginSchema } from '../utils/userValidation.js';

const router = express.Router();

router.post('/register', validateBody(userSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;