const { userServices } = require("../service/users")
const { createUser, findUser } = userServices;

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
*       200:
*         description: Returns success message
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
            req.body.profilePicture = await commonFunction.uploadImageCloudnary(profilePicture);
        }

        // Create the user in the database
        const result = await createUser(req.body);

        // Generate JWT token for the newly registered user
        const token = await commonFunction.generateJWT({ id: result._id });

        // Return success response with token and user details
        return res.status(200).send({ status: true, message: "User Register Successfully", token: token, result: result });
    } catch (error) {
        // Return error response if an error occurs
        return res.status(500).send({ status: false, message: error.message });
    }
}