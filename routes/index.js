import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Route to get the status of Redis and MongoDB clients
router.get('/status', AppController.getStatus);

// Route to get the statistics of the application
router.get('/stats', AppController.getStat);

// Route to create a new user
router.post('/users', UsersController.createUser);

// Route to find a user by email
router.get('/users', authMiddleware, UsersController.findUser);

// Route to Authenticate user with token
router.post('/connect', AuthController.getConnect);

// Route to Logout or disconnect User by token
router.post('/disconnect', authMiddleware, AuthController.getDisconnect);

// Route to get current user
router.get('/users/me', authMiddleware, UsersController.getMe);

export default (app) => {
    // Use the defined routes in the express application
    app.use('/', router);
};
