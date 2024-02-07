const {Types: {ObjectId}} = require('mongoose');

const { taskServices } = require("../service/tasks")
const { createTask, findTask, updateTask, deleteTask, taskList, taskSort, taskAggregate } = taskServices;


/**
* @swagger
* /tasks/create-task:
*   post:
*     summary: Create new task
*     tags:
*       - Task Section
*     description: Create new task
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: user token
*         in: header
*         required: true
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/task'
*     responses:
*       '200':
*         description: OK
*       '401':
*         description: Unauthorized
*       '402':
*         description: Bad Request
*       '500':
*         description: Internal Server Error
*/
exports.createTask = async (req, res, next) => {
    try {
        // Create a new task with the provided data and associate it with the logged-in user
        const taskResult = await createTask({ ...req.body, userId: req.userId });
        
        // Return successful response with details of the created task
        return res.status(201).send({ status: true, message: "Created Task Successfully", result: taskResult });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}

/**
* @swagger
* /tasks/get-tasks-by-user:
*   get:
*     summary: Get tasks by user
*     tags:
*       - Task Section
*     description: Get tasks by user
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: user token
*         in: header
*         required: true
*     responses:
*       '200':
*         description: OK
*       '401':
*         description: Unauthorized
*       '402':
*         description: Bad Request
*       '500':
*         description: Internal Server Error
*/
exports.getTasksByUser = async (req, res, next) => {
    try {
        // Retrieve tasks associated with the logged-in user
        const taskResult = await taskList({ userId: req.userId });
        
        // Return successful response with tasks for the user
        return res.status(200).send({ status: true, message: "Get Tasks Successfully", result: taskResult });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}

/**
* @swagger
* /tasks/update-tasks/{taskId}:
*   put:
*     summary: Update Task
*     tags:
*       - Task Section
*     description: Update Task
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: user token
*         in: header
*         required: true
*       - name: taskId
*         description: Task document id
*         in: path
*         required: true
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/updateTask'
*     responses:
*       '200':
*         description: OK
*       '401':
*         description: Unauthorized
*       '402':
*         description: Bad Request
*       '500':
*         description: Internal Server Error
*/
exports.updateTask = async (req, res, next) => {
    try {
        // Extract taskId from request parameters
        const { taskId } = req.params;
        
        // Check if the task exists and belongs to the logged-in user
        const isTask = await findTask({ _id: taskId, userId: req.userId });

        // If the task is not found, return a 404 error
        if (!isTask) {
            return res.status(404).send({ status: false, message: "Task not found" });
        }

        // Update the task with the provided data
        const taskResult = await updateTask({ _id: isTask._id }, { $set: req.body });

        // Return successful response with updated task details
        return res.status(200).send({ status: true, message: "Updated Task Successfully", result: taskResult });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}

/**
* @swagger
* /tasks/delete-tasks/{taskId}:
*   delete:
*     summary: delete Task
*     tags:
*       - Task Section
*     description: delete Task
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: user token
*         in: header
*         required: true
*       - name: taskId
*         description: Task document id
*         in: path
*         required: true
*     responses:
*       '200':
*         description: OK
*       '401':
*         description: Unauthorized
*       '402':
*         description: Bad Request
*       '500':
*         description: Internal Server Error
*/
exports.deleteTask = async (req, res, next) => {
    try {
        // Extract taskId from request parameters
        const { taskId } = req.params;
        
        // Check if the task exists and belongs to the logged-in user
        const isTask = await findTask({ _id: taskId, userId: req.userId });

        // If the task is not found, return a 404 error
        if (!isTask) {
            return res.status(404).send({ status: false, message: "Task not found" });
        }

        // Delete the task
        const taskResult = await deleteTask({ _id: isTask._id });

        // Return successful response with deleted task details
        return res.status(200).send({ status: true, message: "Deleted Task Successfully", result: taskResult });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}

/**
* @swagger
* /tasks/get-completed-tasks-by-user:
*   get:
*     summary: Get tasks by user
*     tags:
*       - Task Section
*     description: Get tasks by user
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: user token
*         in: header
*         required: true
*     responses:
*       '200':
*         description: OK
*       '401':
*         description: Unauthorized
*       '402':
*         description: Bad Request
*       '500':
*         description: Internal Server Error
*/
exports.getCompletedTasksByUser = async (req, res, next) => {
    try {
        // Query completed tasks for the logged-in user
        const taskResult = await taskList({ userId: req.userId, completed: true });
        
        // Return successful response with completed tasks
        return res.status(200).send({ status: true, message: "Get Completed Tasks Successfully", result: taskResult });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}


/**
* @swagger
* /tasks/get-tasks-by-user-due-in-next-7-days:
*   get:
*     summary: Get tasks by user
*     tags:
*       - Task Section
*     description: Get tasks by user
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: user token
*         in: header
*         required: true
*     responses:
*       '200':
*         description: OK
*       '401':
*         description: Unauthorized
*       '402':
*         description: Bad Request
*       '500':
*         description: Internal Server Error
*/
exports.getTasksByUserDueInNext7Days = async (req, res, next) => {
    try {
        // Get the current date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

        // Calculate the date for one week from today
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        nextWeek.setHours(23, 59, 59, 599); // Set hours, minutes, seconds, and milliseconds to the end of the day

        // Query tasks due within the next 7 days for the logged-in user
        const taskResult = await taskList({ userId: req.userId, dueDate: { $gte: today, $lte: nextWeek } });

        // Return successful response with tasks due in the next 7 days
        return res.status(200).send({ status: true, message: "Get tasks due in the next 7 days successfully", result: taskResult });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}

/**
* @swagger
* /tasks/get-specific-title-tasks-by-user:
*   post:
*     summary: Get tasks by user
*     tags:
*       - Task Section
*     description: Get tasks by user
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: user token
*         in: header
*         required: true
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/taskTitles'
*     responses:
*       '200':
*         description: OK
*       '401':
*         description: Unauthorized
*       '402':
*         description: Bad Request
*       '500':
*         description: Internal Server Error
*/
exports.getSpecificTitleTasksByUser = async (req, res, next) => {
    try {
        // Query tasks based on specific titles for the logged-in user
        const taskResult = await taskList({ userId: req.userId, title: { $in: req.body } });

        // Return successful response with tasks based on specific titles
        return res.status(200).send({ status: true, message: "Get Specific Titles tasks successfully", result: taskResult });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}

/**
* @swagger
* /tasks/get-tasks-by-user-by-sorting:
*   get:
*     summary: Get tasks by user
*     tags:
*       - Task Section
*     description: Get tasks by user
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: user token
*         in: header
*         required: true
*       - name: sortBy
*         description: Sort By
*         in: query
*         required: true
*         schema:
*           type: string
*           enum: 
*             - ascending
*             - descending
*     responses:
*       '200':
*         description: OK
*       '401':
*         description: Unauthorized
*       '402':
*         description: Bad Request
*       '500':
*         description: Internal Server Error
*/
exports.getTasksByUserBySortingDueDate = async (req, res, next) => {
    try {
        // Extract the sortBy parameter from the request query
        const { sortBy } = req.query;

        // Define the sorting object based on the sortBy parameter
        const sortObj = sortBy === "ascending" ? { dueDate: 1 } : { dueDate: -1 };

        // Query tasks due within the next 7 days for the logged-in user
        const taskResult = await taskSort({ userId: req.userId }, sortObj);

        // Return successful response with tasks due in the next 7 days
        return res.status(200).send({ status: true, message: "Get Sorting Due Date Titles tasks successfully", result: taskResult });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}

/**
* @swagger
* /tasks/get-tasks-by-user-pagination:
*   get:
*     summary: Get tasks by user
*     tags:
*       - Task Section
*     description: Get tasks by user
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: user token
*         in: header
*         required: true
*       - name: page
*         description: page
*         in: query
*         required: true
*       - name: limit
*         description: limit
*         in: query
*         required: true
*     responses:
*       '200':
*         description: OK
*       '401':
*         description: Unauthorized
*       '402':
*         description: Bad Request
*       '500':
*         description: Internal Server Error
*/
exports.getTasksByUserPagination = async (req, res, next) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate skip value
        const skip = (page - 1) * limit;
        const userId = req.userId;

        const pipeline = [
            { $match: { userId: new ObjectId(userId) } },
            { $facet: {
                totalCount: [{ $group: { _id: null, count: { $sum: 1 } } }],
                paginatedTasks: [
                    { $skip: skip },
                    { $limit: limit }
                ]
            }}
        ];
        
        // Perform aggregation to calculate total count and fetch paginated tasks
        const aggregationResult = await taskAggregate(pipeline)

        // Extract total count and calculate total pages
        const totalCount = aggregationResult[0].totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);

        // Extract paginated tasks
        const tasks = aggregationResult[0].paginatedTasks;

        const data = {
            data: tasks,
            page: page,
            limit: limit,
            totalPages: totalPages
        }

        // Return successful response with tasks due in the next 7 days
        return res.status(200).send({ status: true, message: "Get tasks successfully with pagination apply.", result: data });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}