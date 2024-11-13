
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { UPLOAD_DIR } from './constants/constants.js';

dotenv.config();

export function setupServer() {
  const app = express();

  // Middleware для CORS, JSON та cookies
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Роутинг для контактів та авторизації
  app.use('/auth', authRoutes);
  app.use('/contacts', contactRoutes);

  // Налаштування Swagger UI
  app.use('/uploads', express.static(UPLOAD_DIR));
app.use('/api-docs', swaggerDocs());

  // Логування запитів
  const logger = pino();
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // Обробка невідомих маршрутів та помилок
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Налаштування порту сервера
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
