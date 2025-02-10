const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('test', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;