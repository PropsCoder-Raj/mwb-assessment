// Import the Express framework
const express = require('express');

const controller = require('../controllers/users');

// Create a new router instance
const router = express.Router();

// Define a route handler for GET requests to the root endpoint ('/')
router.post('/register', controller.register);

// Export the router instance to make it available for use in other parts of the application
module.exports = router;
