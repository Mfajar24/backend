const { Jawaban, Tugas, User } = require('../models');

exports.createJawaban = async (req, res) => {
  const { task_id, student_id, text } = req.body;
  const file = req.file?.filename || null;
  const created_at = new Date();

  try {
    const tugas = await Tugas.findByPk(task_id);
    if (!tugas) return res.status(404).json({ error: 'Tugas tidak ditemukan' });
    if (new Date(tugas.deadline) < new Date()) {
      return res.status(400).json({ error: 'Tugas sudah melewati deadline.' });
    }

    const existing = await Jawaban.findOne({ where: { task_id, student_id } });
    if (existing) return res.status(400).json({ error: 'Jawaban sudah pernah dikirim.' });

    const jawaban = await Jawaban.create({ task_id, student_id, text, file, created_at });
    res.json({ message: 'Jawaban dikirim', id: jawaban.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editJawaban = async (req, res) => {
  const { text } = req.body;
  const file = req.file?.filename || null;
  const id = req.params.id;

  try {
    const jawaban = await Jawaban.findByPk(id);
    if (!jawaban) return res.status(404).json({ error: 'Jawaban tidak ditemukan' });
    if (jawaban.nilai != null) return res.status(400).json({ error: 'Sudah dinilai' });

    const tugas = await Tugas.findByPk(jawaban.task_id);
    if (new Date(tugas.deadline) < new Date()) {
      return res.status(400).json({ error: 'Tugas sudah melewati deadline.' });
    }

    await jawaban.update({ text, file: file || jawaban.file, created_at: new Date() });
    res.json({ message: 'Jawaban diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cekJawaban = async (req, res) => {
  const { task_id, student_id } = req.params;
  try {
    const jawaban = await Jawaban.findOne({ where: { task_id, student_id } });
    res.json(jawaban || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllJawaban = async (req, res) => {
  try {
    const data = await Jawaban.findAll({
      include: [{ model: Tugas, attributes: ['title'] }],
      order: [['created_at', 'DESC']],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.nilaiJawaban = async (req, res) => {
  const { nilai, feedback } = req.body;
  const id = req.params.id;

  try {
    const jawaban = await Jawaban.findByPk(id);
    if (!jawaban) return res.status(404).json({ error: 'Jawaban tidak ditemukan' });

    await jawaban.update({ nilai, feedback });
    res.json({ message: 'Nilai berhasil disimpan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.laporanNilai = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'student' },
      include: {
        model: Jawaban,
        include: { model: Tugas, attributes: ['title'] },
      },
      order: [['name', 'ASC']],
    });

    const laporan = [];
    for (const user of users) {
      const tugasList = await Tugas.findAll();
      for (const tugas of tugasList) {
        const jwbn = user.Jawabans.find(j => j.task_id === tugas.id);
        laporan.push({
          student_name: user.name,
          student_id: user.student_id,
          task_title: tugas.title,
          nilai: jwbn?.nilai || null,
          feedback: jwbn?.feedback || null,
          created_at: jwbn?.created_at || null,
        });
      }
    }

    res.json(laporan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
