// Import the Mongoose library
const mongoose = require('mongoose');

// Define the task schema using Mongoose Schema
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

// Create a Mongoose model named 'Task' using the task schema
const Task = mongoose.model('Task', taskSchema);

// Export the Task model to make it available for use in other parts of the application
module.exports = Task;
