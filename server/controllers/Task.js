const models = require('../models');

const { Task } = models;

const makerPage = (req, res) => res.render('app');

const makeTask = async (req, res) => {
  if (!req.body.name || !req.body.priority || req.body.status === undefined) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const taskData = {
    name: req.body.name,
    priority: req.body.priority,
    status: !!req.body.status, // Ensure status is a Boolean
    owner: req.session.account._id,
  };

  try {
    const newTask = new Task(taskData);
    await newTask.save();
    return res.status(201).json({ name: newTask.name, priority: newTask.priority, status: newTask.status });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Task already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred creating task!' });
  }
};

const getTasks = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Task.find(query).select('name priority status').lean().exec();

    return res.json({ tasks: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving tasks!' });
  }
};

const updateTaskStatus = async (req, res) => {
  if (!req.body.taskId || req.body.status === undefined) {
    return res.status(400).json({ error: 'Task ID and status are required!' });
  }

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.body.taskId, owner: req.session.account._id }, // Ensure the task belongs to the user
      { status: req.body.status }, // Update the status field
      { new: true } // Return the updated document
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

module.exports = {
  makerPage,
  makeTask,
  getTasks,
  updateTaskStatus,
};
