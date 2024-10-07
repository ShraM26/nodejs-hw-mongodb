import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';

dotenv.config();

export function setupServer() {
  const app = express();

 
  app.use(cors());

  
  const logger = pino();
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  
  app.use((req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

 
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}