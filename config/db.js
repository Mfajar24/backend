require('dotenv').config(); // Untuk membaca file .env
const { Sequelize } = require('sequelize');

// Inisialisasi koneksi ke database MySQL
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql', 
  logging: false,   
});

module.exports = db;
