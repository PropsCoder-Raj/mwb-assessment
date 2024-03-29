const mongoose = require('mongoose');

const { userServices } = require("../service/users")
const { createUser, findUser, updateUser } = userServices;

const { taskServices } = require("../service/tasks")
const { createTask } = taskServices;

const commonFunction = require("../helper/utils");
const userTypeEnums = require("../enums/userType");


/**
* @swagger
* /users/register:
*   post:
*     summary: Register a new user
*     tags:
*       - User Section
*     description: Register with basic details of user on platform
*     produces:
*       - application/json
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/register'
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
exports.register = async (req, res, next) => {
    try {
        // Extract email and profile picture from request body
        const { email, profilePicture } = req.body;

        // Check if the user already exists in the database
        const isUser = await findUser({ email: email, userType: userTypeEnums.USER });
        if (isUser) {
            // Return error if user already exists
            return res.status(409).send({ status: false, message: "Email is already exist in db." });   
        }

        // If profile picture is provided, upload it to Cloudinary
        if (profilePicture) {
            req.body.profilePicture = await commonFunction.uploadImageCloudinary(profilePicture);
        }

        // Create the user in the database
        const result = await createUser(req.body);

        // Generate JWT token for the newly registered user
        const token = await commonFunction.generateJWT({ id: result._id });

        // Return success response with token and user details
        return res.status(201).send({ status: true, message: "User Register Successfully", token: token, result: result });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}

/**
* @swagger
* /users/login:
*   post:
*     summary: Login a new user
*     tags:
*       - User Section
*     description: Login with basic details of user on platform
*     produces:
*       - application/json
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/login'
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
exports.login = async (req, res, next) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Check if the user exists in the database
        const isUser = await findUser({ email: email, userType: userTypeEnums.USER });
        if (!isUser) {
            // Return error if user does not exist
            return res.status(404).send({ status: false, message: "User not found." });   
        }

        // Compare the provided password with the hashed password stored in the database
        const isPassword = await isUser.comparePassword(password)
        console.log("isPassword: ", isPassword)
        if (!isPassword) {
            // Return error if password does not match
            return res.status(401).send({ status: false, message: "Password does not match." });
        }

        // Generate JWT token for the authenticated user
        const token = await commonFunction.generateJWT({ id: isUser._id });

        // Return success response with token and user details
        return res.status(200).send({ status: true, message: "User Login Successfully", token: token, result: isUser });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}

/**
* @swagger
* /users/update-user-and-add-task:
*   put:
*     summary: Update user and add
*     tags:
*       - User Section
*     description: Update user and add
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
*             $ref: '#/definitions/updateUserTask'
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
exports.updateUserAndAddTask = async (req, res, next) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        let { email, name, profilePicture, bio, deviceToken, task_title, task_description, task_dueDate } = req.body;

        // If profile picture is provided, upload it to Cloudinary
        if (profilePicture) {
            profilePicture = await commonFunction.uploadImageCloudinary(profilePicture);
        }

        console.log("req.userId: ", req.userId)

        // Update user details
        await updateUser({ _id: req.userId }, { $set: { 
            email: email, 
            name: name, 
            profilePicture: profilePicture, 
            bio: bio, 
            deviceToken: deviceToken 
        }}, { session });

        // Create a new task
        await createTask({ title: task_title, description: task_description, dueDate: task_dueDate, userId: req.userId }, { session });

        const userResult = await findUser({ _id: req.userId });
        if(userResult.deviceToken){
            const message = {
                notification: {
                    title: 'Task Updated',
                    body: `A task has been updated: ${req.body.title}`,
                },                
                token: userResult.deviceToken, // User's FCM token retrieved during authentication
            };
            commonFunction.sendMessage(message);
        }

        // Commit the transaction
        await session.commitTransaction();
        console.log('Transaction committed successfully');

        // Return success response with token and user details
        return res.status(201).send({ status: true, message: "User updated and task added successfully" });
    } catch (error) {
        await session.abortTransaction();
        console.error('Transaction aborted:', error);

        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: "An error occurred while updating user and adding task" });
    } finally {
        // End the session
        session.endSession();
    }
}