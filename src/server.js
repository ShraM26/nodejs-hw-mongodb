import express from 'express';
import cors from 'cors';
import pino from 'pino';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js';


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
    res.status(404).json({
      message: 'Not found',
    });
  });

 
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

};
