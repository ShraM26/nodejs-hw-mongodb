import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // Додайте імпорт cookie-parser
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Додайте імпорт authRoutes
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

dotenv.config();

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser()); // Додайте middleware для парсингу куків

  // Додайте маршрути для аутентифікації
  app.use('/auth', authRoutes);
  // Додайте маршрути для контактів
  app.use('/contacts', contactRoutes);  

  const logger = pino();
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.use(notFoundHandler); // Справжня обробка 404
  app.use(errorHandler);     // Обробка інших помилок

  const PORT = process.env.PORT || 3000; // Значення за замовчуванням для порту
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}