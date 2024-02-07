// Import the Express framework
const express = require('express');

// Import middleware for token verification
const { verifyToken } = require("../../middlewares");

// Import the controller module for task operations
const controller = require('../controllers/tasks');

// Create a new router instance
const router = express.Router();

// Define a route handler for POST requests to the '/create-task' endpoint
router.post('/create-task', verifyToken, controller.createTask);

// Define a route handler for GET requests to the '/get-tasks-by-user' endpoint
router.get('/get-tasks-by-user', verifyToken, controller.getTasksByUser);

// Define a route handler for PUT requests to the '/update-tasks' endpoint
router.put('/update-tasks/:taskId', verifyToken, controller.updateTask);

// Define a route handler for DELETE requests to the '/delete-tasks' endpoint
router.delete('/delete-tasks/:taskId', verifyToken, controller.deleteTask);

// Define a route handler for GET requests to the '/get-completed-tasks-by-user' endpoint
router.get('/get-completed-tasks-by-user', verifyToken, controller.getCompletedTasksByUser);

// Define a route handler for GET requests to the '/get-tasks-by-user-due-in-next-7-days' endpoint
router.get('/get-tasks-by-user-due-in-next-7-days', verifyToken, controller.getTasksByUserDueInNext7Days);

// Export the router instance to make it available for use in other parts of the application
module.exports = router;
