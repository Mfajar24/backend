const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const KomentarGaleri = sequelize.define('KomentarGaleri', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  galeri_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'komentar',
  timestamps: false,
});

module.exports = KomentarGaleri;
 