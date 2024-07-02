import sha1 from 'sha1'; // Importing sha1 for password hashing
import dbClient from '../utils/db'; // Importing database client
import { v4 as uuidv4 } from 'uuid'; // Importing uuid for generating unique tokens
import redisClient from '../utils/redis'; // Importing Redis client

class AuthController {
    /**
     * Handles user authentication and token generation
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Object} - The response object with the authentication token or an error message
     */
    static async getConnect(req, res) {
        // Extract the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Decode Base64 credentials
        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, password] = credentials.split(':');

        if (!email || !password) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Hash the password using sha1
        const hashedPassword = sha1(password);

        try {
            // Find user in the database by email and hashed password
            const user = await dbClient.getUserByEmailAndPassword(email, hashedPassword);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Generate a unique token
            const token = uuidv4();
            const key = `auth_${token}`;

            // Store the token in Redis with an expiration time of 24 hours (86400 seconds)
            await redisClient.set(key, user._id.toString(), 'EX', 86400);

            return res.status(200).json({ token });
        } catch (error) {
            console.error('Error authenticating user:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    /**
     * Handles user logout by deleting the authentication token
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Object} - The response object with status 204 on success or an error message
     */
    static async getDisconnect(req, res) {
        // Extract the token from the headers
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const key = `auth_${token}`;
        try {
            // Delete the token from Redis
            const deleted = await redisClient.del(key);
            if (deleted !== 1) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            return res.status(204).send();
        } catch (error) {
            console.error('Error disconnecting user:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    }
}

export default AuthController;
