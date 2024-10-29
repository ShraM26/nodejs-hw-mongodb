import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authenticate = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw createError(401, 'Authorization header missing');
    }

    const token = authorizationHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    if (decoded.exp < Date.now() / 1000) {
      throw createError(401, 'Access token expired');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;