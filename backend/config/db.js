const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('task_db', 'root', 'golden', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
