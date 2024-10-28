import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import authenticate from './middlewares/authenticate.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// MongoDB Connection Initialization
const initMongoConnection = async () => {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
  const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connection established successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Exit process if database connection fails
  }
};

// Main Server Setup
const setupServer = () => {
  const app = express();

  // Middleware Setup
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Logger Setup
  const logger = pino();
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // Routes
  app.use('/auth', authRoutes);
  
  // Apply `authenticate` middleware to protect all contact routes
  app.use('/contacts', authenticate, contactRoutes);

  // 404 and Error Handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Start Server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Initialize Database and Start Server
initMongoConnection()
  .then(() => setupServer())
  .catch((error) => {
    console.error('Failed to initialize server:', error);
  });

export { setupServer };