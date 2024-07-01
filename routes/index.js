import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

// Route to get the status of Redis and MongoDB clients
router.get('/status', AppController.getStatus);

// Route to get the statistics of the application
router.get('/stats', AppController.getStat);

// Route to create a new user
router.post('/users', AppController.createUser);

// Route to find a user by email
router.get('/users', AppController.findUser);

export default (app) => {
  // Use the defined routes in the express application
  app.use('/', router);
};
