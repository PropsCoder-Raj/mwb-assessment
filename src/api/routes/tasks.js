// Import the Express framework
const express = require('express');

const { validateRequest } = require("../../middlewares")
const { taskCreateSchema, taskUpdateSchema } = require("../helper/validationSchema")

// Import middleware for token verification
const { verifyToken } = require("../../middlewares");

// Import the controller module for task operations
const controller = require('../controllers/tasks');

// Create a new router instance
const router = express.Router();

// Define a route handler for POST requests to the '/create-task' endpoint
router.post('/create-task', verifyToken, validateRequest(taskCreateSchema), controller.createTask);

// Define a route handler for GET requests to the '/get-tasks-by-user' endpoint
router.get('/get-tasks-by-user', verifyToken, controller.getTasksByUser);

// Define a route handler for PUT requests to the '/update-tasks' endpoint
router.put('/update-tasks/:taskId', verifyToken, validateRequest(taskUpdateSchema),  controller.updateTask);

// Define a route handler for DELETE requests to the '/delete-tasks' endpoint
router.delete('/delete-tasks/:taskId', verifyToken, controller.deleteTask);

// Define a route handler for GET requests to the '/get-completed-tasks-by-user' endpoint
router.get('/get-completed-tasks-by-user', verifyToken, controller.getCompletedTasksByUser);

// Define a route handler for GET requests to the '/get-tasks-by-user-due-in-next-7-days' endpoint
router.get('/get-tasks-by-user-due-in-next-7-days', verifyToken, controller.getTasksByUserDueInNext7Days);

// Define a route handler for POST requests to the '/get-specific-title-tasks-by-user' endpoint
router.post('/get-specific-title-tasks-by-user', verifyToken, controller.getSpecificTitleTasksByUser);

// Define a route handler for GET requests to the '/get-tasks-by-user-by-sorting' endpoint
router.get('/get-tasks-by-user-by-sorting', verifyToken, controller.getTasksByUserBySortingDueDate);

// Define a route handler for GET requests to the '/get-tasks-by-user-pagination' endpoint
router.get('/get-tasks-by-user-pagination', verifyToken, controller.getTasksByUserPagination);

// Export the router instance to make it available for use in other parts of the application
module.exports = router;
