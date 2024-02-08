// Import required packages
const userTypeEnums = require('../enums/userType');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  profilePicture: { type: String },
  bio: { type: String },
  deviceToken: { type: String },
  userType: { type: String, enum: [userTypeEnums.USER, userTypeEnums.USER], default: userTypeEnums.USER},
}, { timestamps: true });

// Hash the password before saving it to the database
userSchema.pre('save', async function(next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Define the comparePassword method
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Exclude password field when converting user document to JSON
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Create the User model
const User = mongoose.model('User', userSchema);

// Export User model
module.exports = User;
