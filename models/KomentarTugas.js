const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const KomentarTugas = sequelize.define('KomentarTugas', {
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'komentar_tugas',
  timestamps: false,
});

module.exports = KomentarTugas;
