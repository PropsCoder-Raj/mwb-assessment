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
  const { token } = req.headers;

  if (!token) {
    return res.status(404).send({ status: false, message: "User Token not found." });
  }

  jwt.verify(req.headers.token, process.env.jwtsecret, async (err, result) => {
    if (err) {
      if (err.name == "TokenExpiredError") {
        return res.status(440).send({
          responseCode: 440,
          responseMessage: "Session Expired, Please login again.",
        });
      }
      else {
        return res.status(401).send({
          responseCode: 401,
          responseMessage: "Unauthorized person.",
        });
      }
    }
    else {
      const isUser = await findUser({ _id: result.id, userType: userTypeEnums.USER });
      if (!isUser) {
        return res.status(404).json({
          responseCode: 404,
          responseMessage: "User not found."
        })
      }

      req.userId = result.id;
      next();
    }
  })
}

// Export the middleware functions for use in other parts of the application
module.exports = {
  notFound,
  errorHandler,
  verifyToken
};
