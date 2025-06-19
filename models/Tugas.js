const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Tugas', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    deadline: DataTypes.DATE,
    file: DataTypes.STRING,
  }, {
    tableName: 'tugas',
    timestamps: false,
  });
};
