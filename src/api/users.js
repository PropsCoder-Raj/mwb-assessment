// Import the Express framework
const express = require('express');

// Create a new router instance
const router = express.Router();

// Define a route handler for GET requests to the root endpoint ('/')
router.get('/', (req, res) => {
  // Respond with a JSON array containing emojis
  res.json({ status: true, message: "API Call Testing" });
});

// Export the router instance to make it available for use in other parts of the application
module.exports = router;
