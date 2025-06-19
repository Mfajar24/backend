const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './registration.sqlite',  // Ganti nama file database disini
  logging: false,
});

module.exports = sequelize;
