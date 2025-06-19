const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('TugasView', {
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    viewed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'tugas_views',
    timestamps: false,
  });
};
