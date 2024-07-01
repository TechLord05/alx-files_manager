import { MongoClient } from 'mongodb';
import crypto from 'crypto';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

/* class for performing mongo operation */
class DBClient {
  constructor() {
    // connect to mogodb database
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect()
      .then(() => {
        this.db = this.client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      })
      .catch((err) => {
        console.error(err.message);
        this.db = false;
      });
  }

  /**
   * Method that checks if connection is alive
   * @return {boolean} true if the connection is alive or false if not
   */
  isAlive() {
    return Boolean(this.db);
  }

  /**
   * Method that gets the number of users in the collection
   * @return {Number} return number of documents in the collection users
   */
  async nbUsers() {
    return this.usersCollection.countDocuments();
  }

  /**
   * Method that gets the number of files in the collection
   * @return {Number} return number of documents in the collection files
   */
  async nbFiles() {
    return this.filesCollection.countDocuments();
  }

  /**
   * Method to create a user
   * @param {String} email - The user's email
   * @param {String} password - The user's password
   * @return {Object} The created user with only id and email
   */
  async createUser(email, password) {
    const existingUser = await this.usersCollection.findOne({ email });
    if (existingUser) {
      throw new Error('Already exist');
    }
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
    const result = await this.usersCollection.insertOne({ email, password: hashedPassword });
    return { id: result.insertedId, email };
  }

  /**
   * Method to find a user by email
   * @param {String} email - The user's email
   * @return {Object} The user document if found
   */
  async findUser(email) {
    return this.usersCollection.findOne({ email });
  }
}

const dbClient = new DBClient();

export default dbClient;
