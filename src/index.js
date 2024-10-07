import { setupServer } from './server.js';
import  initMongoConnection  from './db/initMongoConnection.js';


initMongoConnection()
  .then(() => {
  
    setupServer();
  })
  .catch((error) => {
    console.error('Failed to initialize MongoDB connection:', error);
  });