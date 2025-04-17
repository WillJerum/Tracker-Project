const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  priority: {
    type: Number,
    min: 0,
    required: true,
  },
  status: {
    type: Boolean,
    min: 1,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

TaskSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  priority: doc.priority,
  status: doc.status,
});

const TaskModel = mongoose.model('Task', TaskSchema);
module.exports = TaskModel;
