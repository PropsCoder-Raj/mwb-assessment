// Import the Express framework
const express = require('express');
const { verifyToken } = require("../../middlewares")

// Import the controller module for taks operations
const controller = require('../controllers/tasks');

// Create a new router instance
const router = express.Router();

// Define a route handler for POST requests to the '/create-task' endpoint
router.post('/create-task', verifyToken, controller.createTask);

// Define a route handler for GET requests to the '/get-tasks-by-user' endpoint
router.get('/get-tasks-by-user', verifyToken, controller.getTasksByUser);

// Define a route handler for PUT requests to the '/update-tasks' endpoint
router.put('/update-tasks/:taskId', verifyToken, controller.updateTask);

// Define a route handler for PUT requests to the '/update-tasks' endpoint
router.delete('/delete-tasks/:taskId', verifyToken, controller.deleteTask);

// Export the router instance to make it available for use in other parts of the application
module.exports = router;
