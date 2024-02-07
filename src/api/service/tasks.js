const taskModel = require('../model/Task');

const taskServices = {
    // Function to create a new task
    createTask: async (insertObj) => {
        return await taskModel.create(insertObj);
    },
    // Function to find a task based on query
    findTask: async (query) => {
        return await taskModel.findOne(query);
    },
    // Function to update a task based on query
    updateTask: async (query, updateObj) => {
        return await taskModel.findOneAndUpdate(query, updateObj, { new: true, upsert: true});
    },
    // Function to delete a task based on query
    deleteTask: async (query) => {
        return await taskModel.findOneAndDelete(query);
    },
    // Function to retrieve a list of tasks based on query
    taskList: async (query) => {
        return await taskModel.find(query);
    },
    // Function to retrieve a sorted list of tasks based on query and sort query
    taskSort: async (query, sortQuery) => {
        return await taskModel.find(query).sort(sortQuery);
    },
}

module.exports = { taskServices };
