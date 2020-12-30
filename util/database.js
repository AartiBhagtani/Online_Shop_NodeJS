const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete', 'root', 'zVwjjhGX3FeV', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;