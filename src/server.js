
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

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
 

  const swaggerDocument = YAML.load(path.resolve('docs', 'openapi.yaml'));  // Вказуємо абсолютний шлях до openapi.yaml
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
