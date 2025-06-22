const { Sequelize } = require('sequelize');

const db = new Sequelize('techno', 'postgres', 'Fajar123', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // nonaktifkan log SQL
});

module.exports = db;
