// Import the Express framework
const express = require('express');

const { validateRequest } = require("../../middlewares")
const { userSchema, userTaskSchema } = require("../helper/validationSchema")

// Import the controller module for user operations
const controller = require('../controllers/users');

// Create a new router instance
const router = express.Router();

// Define a route handler for POST requests to the '/register' endpoint
router.post('/register', validateRequest(userSchema), controller.register);

// Define a route handler for POST requests to the '/login' endpoint
router.post('/login', validateRequest(userSchema), controller.login);

// Define a route handler for PUT requests to the '/update-user-and-add-task' endpoint
router.put('/update-user-and-add-task', validateRequest(userTaskSchema), controller.updateUserAndAddTask);

// Export the router instance to make it available for use in other parts of the application
module.exports = router;
