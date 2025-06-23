require('dotenv').config();
const fs = require('fs');
const { Sequelize } = require('sequelize');

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql', // atau 'postgres'
    logging: false,
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(__dirname + '/../certs/ca.pem').toString(), // arahkan ke file cert
        rejectUnauthorized: true,
      },
    },
  }
);

module.exports = db;
