const taskModel = require('../model/Task');

const taskServices = {
    createTask: async (insertObj) => {
        return await taskModel.create(insertObj);
    },
    findTask: async (query) => {
        return await taskModel.findOne(query);
    },
    updateTask: async (query, updateObj) => {
        return await taskModel.findOneAndUpdate(query, updateObj, { new: true, upsert: true});
    },
    deleteTask: async (query) => {
        return await taskModel.findOneAndDelete(query);
    },
    taskList: async (query) => {
        return await taskModel.find(query);
    },
}

module.exports = { taskServices };
