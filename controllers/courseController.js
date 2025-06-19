const db = require('../models'); // otomatis ambil index.js, yg sudah export semua model
const { Course, Comment, CourseView, User } = db;
const path = require('path');
const fs = require('fs');


// Mendapatkan semua kursus
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create course
exports.createCourse = async (req, res) => {
  try {
    const { name, description, instructor } = req.body;
    const files = req.files ? req.files.map(f => f.filename) : [];

    const course = await Course.create({
      name,
      description,
      instructor,
      files: JSON.stringify(files),
    });

    res.json({ message: 'Kursus ditambahkan', courseId: course.id });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ error: 'Kursus tidak ditemukan' });

    const { name, description, instructor } = req.body;

    // Ambil file baru jika ada, kalau tidak, pakai file lama
    const newFiles = req.files ? req.files.map(f => f.filename) : [];
    const filesToSave = newFiles.length ? newFiles : JSON.parse(course.files || '[]');

    await course.update({
      name,
      description,
      instructor,
      files: JSON.stringify(filesToSave),
    });

    res.json({ message: 'Kursus diperbarui' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Menghapus kursus
exports.deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ error: 'Kursus tidak ditemukan' });

    // ✅ Hapus komentar terkait kursus
    await Comment.destroy({ where: { course_id: courseId } });

    // ✅ Hapus data view terkait kursus
    await CourseView.destroy({ where: { course_id: courseId } });

    // ✅ Ambil dan hapus file dari folder uploads
    const files = JSON.parse(course.files || '[]');

    for (const filename of files) {
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`❌ Gagal menghapus file ${filename}:`, err.message);
          // Tidak hentikan proses jika gagal hapus satu file
        }
      }
    }

    // ✅ Hapus data kursus
    await course.destroy();

    res.json({ message: 'Kursus berhasil dihapus' });
  } catch (error) {
    console.error('❌ Error hapus kursus:', error.message);
    res.status(500).json({ error: 'Gagal menghapus kursus.' });
  }
};
// Mencatat tampilan (view) kursus
exports.recordView = async (req, res) => {
  const course_id = req.params.id;
  const { student_id } = req.body;

  if (!student_id) return res.status(400).json({ error: 'student_id wajib diisi.' });

  try {
    const course = await Course.findByPk(course_id);
    if (!course) return res.status(404).json({ error: 'Kursus tidak ditemukan.' });

    // Cari atau buat view jika belum ada (insert or ignore)
    await CourseView.findOrCreate({
      where: { course_id, student_id },
      defaults: { viewed_at: new Date() },
    });

    res.status(201).json({ message: 'View kursus tercatat' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mendapatkan daftar view course beserta nama user
exports.getCourseViews = async (req, res) => {
  const course_id = req.params.id;

  try {
    const views = await CourseView.findAll({
      where: { course_id },
      include: [{ model: User, attributes: ['name'] }],
      order: [['viewed_at', 'ASC']],
    });

    console.log(JSON.stringify(views, null, 2));  // Tambahkan ini
    res.json(views);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
