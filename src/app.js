// Import required dependencies
const express = require('express'); // Express.js framework
const morgan = require('morgan'); // HTTP request logger middleware
const helmet = require('helmet'); // Security middleware
const cors = require('cors'); // Cross-origin resource sharing middleware

require('dotenv').config(); // Load environment variables from .env file

// Import custom middleware functions
const middlewares = require('./middlewares');

// Import API routes
const api = require('./api');

// Create an instance of the Express application
const app = express();

// Middleware setup
app.use(morgan('dev')); // Log HTTP requests to the console in development mode
app.use(helmet()); // Set various HTTP headers to secure the application
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// Mount API routes
app.use('/api/v1', api); // Mount the API routes under /api/v1

// Handle 404 Not Found errors using custom middleware
app.use(middlewares.notFound);

// Error handling middleware
app.use(middlewares.errorHandler);

// Export the Express application instance
module.exports = app;
