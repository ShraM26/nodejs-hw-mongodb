import express from 'express';
import { register, login, refresh, logout, sendResetEmail, resetPassword } from '../controllers/authController.js';
import validateBody from '../middlewares/validateBody.js';
import { userSchema, loginSchema, emailSchema, resetPasswordSchema  } from '../utils/userValidation.js';

const router = express.Router();

router.post('/register', validateBody(userSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/send-reset-email', validateBody(emailSchema), sendResetEmail);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPassword);

export default router;