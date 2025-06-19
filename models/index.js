const sequelize = require('../config/db');
const Sequelize = require('sequelize');

const User = require('./User');
const Course = require('./course');
const CourseView = require('./CourseView');
const Comment = require('./comment');
const KomentarTugas = require('./KomentarTugas')
const Tugas = require('./Tugas')(sequelize);
// dan model lain yang juga ekspor fungsi
const TugasView = require('./TugasView')(sequelize);
const Jawaban = require('./Jawaban')(sequelize, Sequelize.DataTypes);
const Galeri = require('./Galeri');
const KomentarGaleri = require('./KomentarGaleri');


// Relasi CourseView
CourseView.belongsTo(User, {
  foreignKey: 'student_id',
  targetKey: 'studentId',
});

CourseView.belongsTo(Course, {
  foreignKey: 'course_id',
  targetKey: 'id',
  onDelete: 'CASCADE',
  hooks: true,
});

Course.hasMany(CourseView, {
  foreignKey: 'course_id',
  onDelete: 'CASCADE',
  hooks: true,
});

// Relasi Comment dengan Course & User
Comment.belongsTo(User, {
  foreignKey: 'student_id',
  targetKey: 'studentId',
});

Comment.belongsTo(Course, {
  foreignKey: 'course_id',
  onDelete: 'CASCADE',
  hooks: true,
});

Course.hasMany(Comment, {
  foreignKey: 'course_id',
  onDelete: 'CASCADE',
  hooks: true,
});

// Relasi Tugas dan KomentarTugas
KomentarTugas.belongsTo(User, {
  foreignKey: 'student_id',
  targetKey: 'studentId',
});

KomentarTugas.belongsTo(Tugas, {
  foreignKey: 'task_id',
  onDelete: 'CASCADE',
  hooks: true,
});

Tugas.hasMany(KomentarTugas, {
  foreignKey: 'task_id',
  onDelete: 'CASCADE',
  hooks: true,
});

// Relasi TugasView
TugasView.belongsTo(User, {
  foreignKey: 'student_id',
  targetKey: 'studentId',
});

TugasView.belongsTo(Tugas, {
  foreignKey: 'task_id',
  onDelete: 'CASCADE',
  hooks: true,
});

Tugas.hasMany(TugasView, {
  foreignKey: 'task_id',
  onDelete: 'CASCADE',
  hooks: true,
});

// Relasi tambahan untuk Jawaban
Jawaban.belongsTo(User, {
  foreignKey: 'student_id',
  targetKey: 'studentId',
});

Jawaban.belongsTo(Tugas, {
  foreignKey: 'task_id',
  onDelete: 'CASCADE',
  hooks: true,
});

Tugas.hasMany(Jawaban, {
  foreignKey: 'task_id',
  onDelete: 'CASCADE',
  hooks: true,
});

User.hasMany(Jawaban, {
  foreignKey: 'student_id',
  sourceKey: 'studentId',
});

//relasi galeri
// Galeri dan User
Galeri.belongsTo(User, {
  foreignKey: 'student_id',
  targetKey: 'studentId',
});
User.hasMany(Galeri, {
  foreignKey: 'student_id',
  sourceKey: 'studentId',
});

// KomentarGaleri dan User
KomentarGaleri.belongsTo(User, {
  foreignKey: 'student_id',
  targetKey: 'studentId',
});
User.hasMany(KomentarGaleri, {
  foreignKey: 'student_id',
  sourceKey: 'studentId',
});

// KomentarGaleri dan Galeri
KomentarGaleri.belongsTo(Galeri, {
  foreignKey: 'galeri_id',
  onDelete: 'CASCADE',
});
Galeri.hasMany(KomentarGaleri, {
  foreignKey: 'galeri_id',
  onDelete: 'CASCADE',
});


module.exports = {
  sequelize,
  User,
  Course,
  CourseView,
  Comment,
  Tugas,
  KomentarTugas,
  TugasView,
  Jawaban,
  Galeri,
  KomentarGaleri,

};
