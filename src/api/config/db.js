const mongoose = require('mongoose'); // Import mongoose
require("dotenv").config()

// MongoDB connection URI
const mongoURI = process.env.mongodb_url;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
