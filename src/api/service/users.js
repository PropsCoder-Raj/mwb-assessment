// Import the user model
const userModel = require('../model/User');

// Define user services
const userServices = {
    // Function to create a new user
    createUser: async (insertObj) => {
        // Create a new user in the database using the user model
        return await userModel.create(insertObj);
    },
    // Function to find a user by query
    findUser: async (query) => {
        // Find a user in the database based on the query, excluding the password field
        return await userModel.findOne(query);
    },
    // Function to update a task based on query
    updateUser: async (query, updateObj) => {
        return await userModel.findOneAndUpdate(query, updateObj, { new: true, upsert: true});
    },
}

// Export the user services
module.exports = { userServices };
