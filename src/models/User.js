const mongoose = require('mongoose');
const validator = require('validator'); // Library used for validating inputs like email.
const bcrypt = require('bcrypt'); // Library used for hashing passwords.
const jwt = require('jsonwebtoken'); // Library used for generating JWT tokens.
const Task = require('./Task'); // Importing the Task model for creating relationships.

const UserSchema = new mongoose.Schema({
  name: {
    type: String, // The 'name' field stores the user's name as a string.
    required: true, // The name is mandatory.
    trim: true // Removes any leading or trailing spaces from the input.
  },
  age: {
    type: Number, // The 'age' field stores the user's age as a number.
    default: 0, // Default age is 0 if not provided.
    min: [0, 'Age cannot be negative'] // Validation: age must be a positive number.
  },
  email: { 
    type: String, // The 'email' field stores the user's email as a string.
    unique: true, // Ensures that each email in the database is unique.
    trim: true, // Removes extra spaces.
    lowercase: true, // Converts the email to lowercase to maintain uniformity.
    required: true, // The email is required for each user.
    validate: { 
      validator: function(v) { 
        return validator.isEmail(v); // Validator function checks if the email is valid.
      },
      message: 'Invalid email address' // Error message shown if email validation fails.
    }
  },
  password: {
    type: String, // The 'password' field stores the user's password.
    required: true, // Password is required for every user.
    trim: true, // Trims the password to remove extra spaces.
    validate: [
        {
          validator: function(v) {
            return v.length > 6; // Password must be longer than 6 characters.
          },
          message: 'Password must be longer than 6 characters'
        },
        {
          validator: function(v) {
            return !v.toLowerCase().includes('password'); // Ensures the password does not contain the word "password".
          },
          message: 'Password cannot contain the word "password"'
        }
      ]
  },
  tokens: [{  
    token: {
      type: String, // The 'tokens' field stores an array of authentication tokens (for managing multiple sessions).
      required: true
    }
  }],
  avatar: {
    type: Buffer // The 'avatar' field stores the user's profile picture as binary data.
  }
}, {
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields to the document.
});

// Setting up a virtual relationship between the User and Task models.
// This allows us to populate user-related tasks without embedding them directly.
UserSchema.virtual('tasks', {
  ref: 'Task', // Refers to the Task model.
  localField: '_id', // The local field is '_id' of the User model.
  foreignField: 'owner' // The foreign field in the Task model that relates to this User is 'owner'.
});

// Middleware that runs before saving a user document (for both creation and updates).
// If the password field is modified, this middleware hashes the password before saving it.
UserSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) { // Check if the password field was changed.
    user.password = await bcrypt.hash(user.password, 8); // Hash the password with bcrypt.
  }
  next(); // Move on to the next middleware or save the user.
});

// Middleware that runs before a user document is removed.
// Deletes all tasks associated with the user when the user is deleted.
UserSchema.pre('remove', async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id }); // Deletes all tasks where the owner is this user.
  next(); // Move on to the next middleware or remove the user.
});

// Method that removes sensitive information (password, tokens, and avatar) before sending the user object as a response.
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password; // Remove password from the returned object.
  delete userObject.tokens; // Remove tokens from the returned object.
  delete userObject.avatar; // Remove avatar (which could be large) from the returned object.

  return userObject; // Return the sanitized user object.
};

// Method for generating an authentication token for a user.
// It generates a JWT token and adds it to the 'tokens' array of the user.
UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET); // Generate a JWT token.

  user.tokens = user.tokens.concat({ token }); // Add the token to the user's tokens array.
  await user.save(); // Save the user document with the new token.
  return token; // Return the generated token.
};

// Static method for finding a user by their email and password.
// This is used for authenticating users during login.
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email }); // Find the user by email.
  if (!user) {
    throw new Error('Unable to Log In...'); // Throw an error if the user is not found.
  }
  const isMatch = await bcrypt.compare(password, user.password); // Compare the provided password with the stored hashed password.

  if (!isMatch) {
    throw new Error('Unable to Log In...'); // Throw an error if the passwords don't match.
  }

  return user; // Return the user if authentication is successful.
};

// Creating the User model based on the UserSchema
const User = mongoose.model('User', UserSchema);

// Exporting the User model so it can be used in other parts of the application.
module.exports = User;
