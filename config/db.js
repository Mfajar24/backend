require('dotenv').config(); // ← Tambahkan ini untuk baca .env
const { Sequelize } = require('sequelize');

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
});

module.exports = db;
