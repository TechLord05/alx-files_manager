import { jwtSecret } from '../config'; // Ensure this path is correct
import jwt from 'jsonwebtoken';
import redisClient from '../utils/redis';

const authMiddleware = async (req, res, next) => {
    const token = req.headers['x-token'];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const key = `auth_${token}`;
        const userExists = await redisClient.exists(key);

        if (!userExists) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

export default authMiddleware;
