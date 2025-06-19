const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Course = require('./course');
const User = require('./User');  // Import User supaya bisa buat relasi

const Comment = sequelize.define('Comment', {
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Course,
            key: 'id'
        }
    },
    student_id: {
        type: DataTypes.STRING, // harus sesuai dengan user.studentId
        allowNull: false,
        references: {
            model: User,
            key: 'studentId'
        }
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'comments'
});

// Tambahkan relasi:
Comment.belongsTo(User, { foreignKey: 'student_id', targetKey: 'studentId' });

module.exports = Comment;
