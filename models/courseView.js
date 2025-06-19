const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CourseView = sequelize.define('CourseView', {
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  student_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  viewed_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'course_views',
  timestamps: false
});

// Associations akan kita buat di file index.js nanti

module.exports = CourseView;
