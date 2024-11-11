import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import swaggerUi from 'swagger-ui-express';  // Імпортуємо swagger-ui-express
import YAML from 'yamljs';  // Імпортуємо yamljs для завантаження OpenAPI YAML файлу
import path from 'path';

dotenv.config();

export function setupServer() {
  const app = express();

  // Додаємо середовище для CORS, JSON та cookies
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Додаємо роути для контактів та авторизації
  app.use('/auth', authRoutes);
  app.use('/contacts', contactRoutes);

  // Налаштовуємо Swagger UI
  const swaggerDocument = YAML.load(path.join('docs', 'openapi.yaml')); // Завантажуємо OpenAPI YAML файл
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));  // Додаємо роут для /api-docs

  // Логування запитів
  const logger = pino();
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  // Обробка невідомих запитів
  app.use(notFoundHandler);
  // Обробка помилок
  app.use(errorHandler);

  // Налаштовуємо сервер
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
