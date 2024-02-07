// Import the Express framework
const express = require('express');

// Import the users router module
const users = require('./users');

// Create a new router instance
const router = express.Router();

// Mount the users router under the '/users' path
router.use('/users', users);

// Export the router instance to make it available for use in other parts of the application
module.exports = router;
