const mongoose = require('mongoose');

// This is the schema definition for the "Task" model, representing tasks that will be stored in MongoDB.
// The Task schema includes four fields: description, completed, owner, and timestamps.

const TaskSchema = new mongoose.Schema({
    description: {
        type: String, // The 'description' field is a string that describes the task.
        required: true, // This field is mandatory, so every task must have a description.
        trim: true // Removes any leading or trailing whitespace from the input.
    },
    completed: {
        type: Boolean, // The 'completed' field is a boolean, indicating whether the task is done or not.
        default: false // The default value is false, meaning tasks are incomplete by default.
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, // The 'owner' field is a reference to the User model.
        required: true, // This field is required, meaning every task must have an associated user (owner).
        ref: 'User' // This creates a relationship with the 'User' model. It tells Mongoose that 'owner' refers to a document from the 'User' collection.
    }
}, {
    timestamps: true // Automatically adds 'createdAt' and 'updatedAt' timestamps to the Task documents.
});

// Creating the Task model based on the TaskSchema
const Task = mongoose.model('Task', TaskSchema);

// Exporting the Task model so it can be used in other parts of the application.
module.exports = Task;
