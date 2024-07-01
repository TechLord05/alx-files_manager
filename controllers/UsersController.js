// controllers/UsersController.js

import dbClient from '../utils/db.js';
import sha1 from 'sha1';

const UsersController = {
    async postNew(req, res) {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Missing email' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Missing password' });
        }

        // Check if the email already exists in the database
        const userExists = await dbClient.getUserByEmail(email);
        if (userExists) {
            return res.status(400).json({ error: 'Already exist' });
        }

        // Hash the password using SHA1
        const hashedPassword = sha1(password);

        // Insert the new user into the database
        try {
            const newUser = await dbClient.createUser(email, hashedPassword);
            res.status(201).json({ id: newUser._id, email: newUser.email });
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: 'Server error' });
        }
    },
};

export default UsersController;
