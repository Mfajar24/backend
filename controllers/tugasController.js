const { Tugas, KomentarTugas, TugasView, User } = require('../models');
const upload = require('../config/multer');

// === CRUD TUGAS ===
exports.getAll = async (req, res) => {
    try {
        const tugas = await Tugas.findAll();
        res.json(tugas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const tugas = await Tugas.findByPk(req.params.id);
        res.json(tugas || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;
        const file = req.file?.filename || null;

        const newTugas = await Tugas.create({ title, description, deadline, file });
        res.json({ message: 'Tugas ditambahkan', id: newTugas.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, deadline } = req.body;
        const file = req.file?.filename;

        const tugas = await Tugas.findByPk(id);
        if (!tugas) return res.status(404).json({ error: 'Tugas tidak ditemukan.' });

        await tugas.update({ title, description, deadline, ...(file && { file }) });

        res.json({ message: 'Tugas diperbarui' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const id = req.params.id;
        const tugas = await Tugas.findByPk(id);
        if (!tugas) return res.status(404).json({ error: 'Tugas tidak ditemukan.' });

        await tugas.destroy();
        res.json({ message: 'Tugas berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// === KOMENTAR ===
// Ambil komentar berdasarkan task id
exports.getKomentar = async (req, res) => {
  try {
    const taskId = req.params.id;
    const komentar = await KomentarTugas.findAll({
      where: { task_id: taskId },
      attributes: ['id', 'comment', 'student_id'],
      order: [['id', 'ASC']],
      include: [{
        model: User,
        attributes: ['name'],
      }],
    });

    const hasil = komentar.map(k => ({
      id: k.id,
      text: k.comment,
      student_id: k.student_id, // ← Tambahkan ini
      student_name: k.User ? k.User.name : null,
    }));

    res.json(hasil);
  } catch (error) {
    console.error('Error di getKomentar:', error);
    res.status(500).json({ error: error.message });
  }
};

// Tambah komentar ke tugas
exports.addKomentar = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { comment, student_id } = req.body;

    if (!comment || !student_id) {
      return res.status(400).json({ error: 'Comment dan student_id harus diisi.' });
    }

    const newKomentar = await KomentarTugas.create({
      comment,
      student_id,
      task_id: taskId
    });

    res.status(201).json(newKomentar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hapus komentar
// Hapus komentar berdasarkan ID (Tanpa Autentikasi)
exports.deleteKomentar = async (req, res) => {
  try {
    const komentarId = req.params.id;  // Ambil ID komentar dari URL
    const { student_id, role } = req.body;  // Mendapatkan info student_id dan role dari body request (mungkin dari form atau frontend)

    // Cari komentar berdasarkan ID
    const komentar = await KomentarTugas.findOne({
      where: { id: komentarId },
      include: [{
        model: User,
        attributes: ['id', 'role'],  // Ambil role dari User
      }],
    });

    // Jika komentar tidak ditemukan
    if (!komentar) {
      return res.status(404).json({ error: 'Komentar tidak ditemukan.' });
    }

    // Cek apakah user yang mengirim komentar atau admin
    if (komentar.student_id !== student_id && role !== 'admin') {
      return res.status(403).json({ error: 'Anda tidak memiliki izin untuk menghapus komentar ini.' });
    }

    // Hapus komentar
    await KomentarTugas.destroy({
      where: { id: komentarId },
    });

    res.status(200).json({ message: 'Komentar berhasil dihapus.' });
  } catch (error) {
    console.error('Error di deleteKomentar:', error);
    res.status(500).json({ error: error.message });
  }
};


// === VIEW TUGAS ===
exports.addView = async (req, res) => {
    try {
        const task_id = req.params.id;
        const { student_id } = req.body;
        const viewed_at = new Date();

        if (!student_id) return res.status(400).json({ error: 'student_id wajib diisi.' });

        await TugasView.findOrCreate({
            where: { task_id, student_id },
            defaults: { viewed_at }
        });

        res.json({ message: 'View tercatat' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getViews = async (req, res) => {
    try {
        const task_id = req.params.id;

        const views = await TugasView.findAll({
            where: { task_id },
            include: [{ model: User, attributes: ['name'] }],
            order: [['viewed_at', 'ASC']]
        });

        const result = views.map(v => ({
            id: v.id,
            student_id: v.student_id,
            viewed_at: v.viewed_at,
            name: v.User.name
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
