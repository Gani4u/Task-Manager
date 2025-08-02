const { Sequelize } = require('sequelize');
const Task = require('../models/task.model');

exports.getTasks = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const tasks = await Task.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [
        [Sequelize.literal(`status = 'Pending'`), 'DESC'],         // Pending first (alphabetically)
        ['createdAt', 'DESC'],     // Newest first
      ]
    });

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong while fetching tasks.' });
  }
};

exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });
  const task = await Task.create({ title, description });
  res.status(201).json(task);
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByPk(id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  await task.update(req.body);
  res.status(200).json(task);
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByPk(id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  await task.destroy();
  res.status(200).json({ message: "Deleted" });
};
