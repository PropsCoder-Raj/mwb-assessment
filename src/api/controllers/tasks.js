const { taskServices } = require("../service/tasks")
const { createTask, findTask, updateTask, deleteTask, taskList } = taskServices;


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
        const task = await createTask({ ...req.body, userId: req.userId });
        return res.status(201).send({ status: true, message: "Created Task Successfully", result: task });
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
        const task = await taskList({ userId: req.userId });
        return res.status(201).send({ status: true, message: "Get Tasks Successfully", result: task });
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
        const { taskId } = req.params;
        const isTask = await findTask({ _id: taskId, userId: req.userId })

        if (!isTask) {
            return res.status(404).send({ status: false, message: "Task not found" });
        }

        const taskResult = await updateTask({ _id: isTask._id }, { $set: req.body });
        return res.status(201).send({ status: true, message: "Updated Task Successfully", result: taskResult });
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
        const { taskId } = req.params;
        const isTask = await findTask({ _id: taskId, userId: req.userId })

        if (!isTask) {
            return res.status(404).send({ status: false, message: "Task not found" });
        }

        const taskResult = await deleteTask({ _id: isTask._id });
        console.log("task: ", taskResult)
        return res.status(200).send({ status: true, message: "Deleted Task Successfully", result: taskResult });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}