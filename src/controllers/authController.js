
import { registerUser, loginUser, refreshSession, logoutUser } from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const userData = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: { name: userData.name, email: userData.email },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await loginUser(req.body);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await refreshSession(req.cookies.refreshToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutUser(req.cookies.refreshToken);
    res.clearCookie('refreshToken');
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};