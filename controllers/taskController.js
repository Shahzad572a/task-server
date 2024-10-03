const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;  
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });  
        }

        const task = new Task({ 
            ...req.body,  
            user: userId  
        });
        
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};







exports.getUserTasksByManger = async (req, res) => {
    const { userId } = req.params;

    try {
        const tasks = await Task.find({ user: userId }); // Change 'userId' to 'user'
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
    }
};
