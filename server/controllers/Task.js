const models = require('../models');
const Task = require('../models/Task');

const { Task: TaskModel } = models;

const makerPage = (req, res) => res.render('app');

// Create a new task
const makeTask = async (req, res) => {
  if (!req.body.name || !req.body.priority) {
    return res.status(400).json({ error: 'Name and priority are required!' });
  }

  try {
    // Count the number of tasks the user has created
    const taskCount = await Task.countDocuments({ owner: req.session.account._id });

    // Check if the user has reached the limit
    if (!req.session.account.premium && taskCount >= 20) {
      return res.status(400).json({ error: 'Task limit reached. Upgrade to premium to create more tasks.' });
    }

    // Create the new task
    const taskData = {
      name: req.body.name,
      priority: req.body.priority,
      description: req.body.description || '', // Default to an empty string if not provided
      status: false, // Default to false
      owner: req.session.account._id,
    };

    const newTask = new TaskModel(taskData);
    await newTask.save();
    return res.status(201).json({
      name: newTask.name,
      priority: newTask.priority,
      description: newTask.description,
      status: newTask.status,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Task already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred creating task!' });
  }
};

// Get all tasks for the logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.session.account._id }).lean();
    res.json({ tasks, isPremium: req.session.account.premium });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load tasks.' });
  }
};

// Helper function for Modal
// Updates the status of a task
const updateTaskStatus = async (req, res) => {
  if (!req.body.taskId || req.body.status === undefined) {
    return res.status(400).json({ error: 'Task ID and status are required!' });
  }

  try {
    const updatedTask = await TaskModel.findOneAndUpdate(
      { _id: req.body.taskId, owner: req.session.account._id }, // Ensure the task belongs to user
      { status: req.body.status }, // Update the status field
      { new: true }, // Return the updated document
    ).select('name priority status').lean();

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found!' });
    }

    return res.json({ task: updatedTask });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error updating task status!' });
  }
};

// Helper function for Modal
// Fetches a task by its ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json({ task });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch task' });
  }
};

module.exports = {
  makerPage,
  makeTask,
  getTasks,
  updateTaskStatus,
  getTaskById,
};
