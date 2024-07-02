// controllers/UsersController.js

import dbClient from '../utils/db';

class UsersController {
  static async createUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = await dbClient.createUser(email, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getUser(req, res) {
    const { email } = req.query;
    try {
      const user = await dbClient.findUser(email);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: 'User not found' });
    }
  }

  static async getMe(req, res) {
    const { userId } = req;
    try {
      const user = await dbClient.getUserById(userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ error: 'User not found' });
    }
  }
}

export default UsersController;
