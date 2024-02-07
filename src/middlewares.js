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

// Export the middleware functions for use in other parts of the application
module.exports = {
  notFound,
  errorHandler,
};
