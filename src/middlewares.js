require("dotenv").config();

const { userServices } = require("./api/service/users")
const { findUser } = userServices;

const jwt = require("jsonwebtoken");
const userTypeEnums = require("./api/enums/userType");

// Middleware to handle 404 Not Found errors
function notFound(req, res, next) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

// Error handling middleware
function errorHandler(err, req, res, next) {
  // Determine the status code to be sent in the response
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);

  // Send JSON response with error details
  res.json({
    message: err.message, // Error message
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack, // Stack trace (in production, show a simple emoji instead of the stack trace)
  });
}

async function verifyToken(req, res, next) {
  // Extract the token from the request headers
  const { token } = req.headers;

  // If token is not provided in the headers
  if (!token) {
    return res.status(404).send({ status: false, message: "User Token not found." });
  }

  // Verify the JWT token
  jwt.verify(token, process.env.jwtsecret, async (err, result) => {
    // If there's an error in verification
    if (err) {
      // If the error is due to token expiration
      if (err.name == "TokenExpiredError") {
        return res.status(440).send({
          responseCode: 440,
          responseMessage: "Session Expired, Please login again.",
        });
      } else {
        return res.status(401).send({
          responseCode: 401,
          responseMessage: "Unauthorized person.",
        });
      }
    } else {
      // Check if the user exists in the database
      const isUser = await findUser({ _id: result.id, userType: userTypeEnums.USER });
      if (!isUser) {
        return res.status(404).json({
          responseCode: 404,
          responseMessage: "User not found."
        })
      }

      // Attach the user ID to the request object for future use
      req.userId = result.id;
      next();
    }
  });
}


// Function for validating incoming requests against a given Joi schema
function validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: false, message: error.details[0].message });
    }
    next();
  };
}

// Export the middleware functions for use in other parts of the application
module.exports = {
  notFound,
  errorHandler,
  verifyToken,
  validateRequest
};
