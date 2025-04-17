const models = require('../models');
const Task = require('../models/Task');

const { Task: TaskModel } = models;

const makerPage = (req, res) => res.render('app');

// Create a new task
const makeTask = async (req, res) => {
  if (!req.body.name || !req.body.priority) {
    return res.status(400).json({ error: 'Name and priority are required!' });
  }

  const taskData = {
    name: req.body.name,
    priority: req.body.priority,
    description: req.body.description || '', // Default to an empty string if not provided
    status: false, // Default to false
    owner: req.session.account._id,
  };

  try {
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
    const query = { owner: req.session.account._id };
    const docs = await TaskModel.find(query).select('name priority status description').lean().exec();

    return res.json({ tasks: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving tasks!' });
  }
};

// Helper function for Modal
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
