const express = require('express');
const router = express.Router();
const Task = require('../models/TaskModel');
const { requireAuth } = require('../middleware/authMiddleware');

// All task routes require a logged-in user
router.use(requireAuth);

// GET /api/tasks — only this user's tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/tasks — create a task owned by this user
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate, priority } = req.body;
        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            user: req.user._id
        });
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH /api/tasks/:id — mark complete / edit
router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to edit this task' });
        }

        const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;