const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter a title'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    dueDate: {
        type: Date,
        required: [true, 'Please enter a due date']
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true });

const Task = mongoose.model('task', taskSchema);

module.exports = Task;