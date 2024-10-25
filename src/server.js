import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';


dotenv.config();

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/contacts', contactRoutes);  

  const logger = pino();
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.use(notFoundHandler); 
  app.use(errorHandler);
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // маршрут для аутентифікації
  app.use('/auth', authRoutes);

  app.use(cookieParser()); // Додамо middleware для парсингу cookies
}