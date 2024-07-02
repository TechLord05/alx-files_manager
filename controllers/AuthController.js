// controllers/AuthController.js

import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { jwtSecret } from '../config';
import redisClient from '../utils/redis';

class AuthController {
    static async getConnect(req, res) {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        // Replace with actual user authentication logic
        if (username === 'bob@example.com' && password === 'toto1234!') {
            const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
            const key = `auth_${token}`;
            await redisClient.set(key, uuidv4(), 'EX', 3600); // Store in Redis with expiration of 1 hour
            return res.json({ token });
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }

    static async getDisconnect(req, res) {
        const token = req.headers['x-token'];
        const key = `auth_${token}`;

        await redisClient.del(key);
        return res.status(204).send();
    }
}

export default AuthController;
