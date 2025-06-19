module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Jawaban', {
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: DataTypes.TEXT,
    file: DataTypes.STRING,
    created_at: DataTypes.DATE,
    nilai: DataTypes.FLOAT,
    feedback: DataTypes.TEXT,
  }, {
    tableName: 'jawaban',
    timestamps: false,
  });
};
