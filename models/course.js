const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Definisikan model Course
const Course = sequelize.define('Course', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    instructor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    files: {
        type: DataTypes.JSON, // Menyimpan file dalam format JSON
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'courses'
});

module.exports = Course;
