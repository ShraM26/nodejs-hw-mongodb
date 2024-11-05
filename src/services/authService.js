import createError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Session from '../models/sessionModel.js';
import nodemailer from 'nodemailer';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  return user;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError(401, 'Invalid email or password');
  }
  await Session.deleteMany({ userId: user._id });

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET, // Впевніться, що ця змінна визначена
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET, // Впевніться, що ця змінна визначена
    { expiresIn: '30d' }
  );

  const session = new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  await session.save();

  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOneAndDelete({ refreshToken });
  if (!session || new Date() > session.refreshTokenValidUntil) {
    throw createError(401, 'Refresh token expired');
  }
  const userId = session.userId;
  const accessToken = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  const newRefreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );

  const newSession = new Session({
    userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  await newSession.save();

  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (refreshToken) => {
  await Session.findOneAndDelete({ refreshToken });
};

export const sendResetEmailService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, "User not found!");
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
  const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `<p>Click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw createError(500, "Failed to send the email, please try again later.");
  }
};

export const resetPasswordService = async (token, newPassword) => {
  let email;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    email = decodedToken.email;
  } catch (error) {
    throw createError(401, "Token is expired or invalid.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw createError(404, "User not found!");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  await Session.deleteMany({ userId: user._id });
};