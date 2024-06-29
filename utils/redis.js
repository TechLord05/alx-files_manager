import { createClient } from 'redis';

/**
 * Class for performing operations with Redis service
 */
class RedisClient {
  constructor() {
    this.client = createClient(); // Create a new Redis client instance

    // Handle Redis client errors
    this.client.on('error', (error) => {
      console.error(`Redis client not connected to the server: ${error.message}`);
    });

    // Log when Redis client connects successfully
    this.client.on('connect', () => {
      console.log('Redis client connected to the server');
    });

    // Connect to the Redis server
    this.client.connect().catch(console.error);
  }

  /**
   * Checks if connection to Redis is alive
   * @return {boolean} true if connection alive or false if not
   */
  isAlive() {
    return this.client.isOpen;
  }

  /**
   * Gets value corresponding to key in Redis
   * @param {string} key - Key to search for in Redis
   * @return {Promise<string>} Value of the key
   */
  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      console.error(`Error getting value from Redis for key "${key}": ${error.message}`);
      return null;
    }
  }

  /**
   * Creates a new key in Redis with a specific TTL
   * @param {string} key - Key to be saved in Redis
   * @param {string} value - Value to be assigned to the key
   * @param {number} duration - TTL (Time to Live) of the key in seconds
   * @return {Promise<void>} No return
   */
  async set(key, value, duration) {
    try {
      console.log(`Setting key "${key}" with value "${value}" and duration "${duration}" seconds`);
      await this.client.setEx(key, duration, value);
    } catch (error) {
      console.error(`Error setting value in Redis for key "${key}": ${error.message}`);
    }
  }

  /**
   * Deletes key in Redis service
   * @param {string} key - Key to be deleted
   * @return {Promise<void>} No return
   */
  async del(key) {
    try {
      console.log(`Deleting key "${key}" from Redis`);
      await this.client.del(key);
    } catch (error) {
      console.error(`Error deleting key "${key}" from Redis: ${error.message}`);
    }
  }
}

const redisClient = new RedisClient();

export default redisClient;
