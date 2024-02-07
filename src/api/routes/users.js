// Import the Express framework
const express = require('express');

// Import the controller module for user operations
const controller = require('../controllers/users');

// Create a new router instance
const router = express.Router();

// Define a route handler for POST requests to the '/register' endpoint
router.post('/register', controller.register);

// Define a route handler for POST requests to the '/login' endpoint
router.post('/login', controller.login);

// Export the router instance to make it available for use in other parts of the application
module.exports = router;
