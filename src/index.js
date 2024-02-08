require("./api/config/db")
require("./websocket")

// Import the Express application from app.js
const app = require('./app');

// Set the port to either the environment variable PORT or 5000 as a default
const port = process.env.PORT || 5000;

// Start the Express server and listen on the specified port
app.listen(port, () => {
  // Log a message indicating that the server is listening
  console.log(`Listening: http://localhost:${port}`);
});
