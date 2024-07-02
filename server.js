// server.js

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index';
import EventEmitter from 'events';

// Increase the maximum number of listeners to 20 (or another suitable number)
EventEmitter.defaultMaxListeners = 20;



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;  // Export the app instance
