// Load environment variables from .env file
require("dotenv").config();

// Import necessary modules
var jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

// Function to generate JWT token
exports.generateJWT = async (payload) => {
    // Generate JWT token with payload and secret key, set expiration time to 24 hours
    return await jwt.sign(payload, process.env.jwtsecret, { expiresIn: "24h" })
}

// Function to upload image to Cloudinary
exports.uploadImageCloudnary = async (base64) => {
    // Configure Cloudinary with your credentials from environment variables
    cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret
    });

    // Upload base64 image to Cloudinary and return the secure URL
    return (await cloudinary.uploader.upload(base64, { resource_type: "auto" })).secure_url
}
