const { Galeri, KomentarGaleri, User } = require('../models'); // pastikan sudah ada model Galeri & GaleriKomentar
const path = require('path');

exports.createGaleri = async (req, res) => {
  try {
    console.log('Request body:', req.body);   // lihat isi body
    console.log('Uploaded file:', req.file);  // lihat info file yang diupload

    const { student_id, text } = req.body;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID wajib diisi.' });
    }

    const fileName = req.file ? req.file.filename : null;

    const galeri = await Galeri.create({
      student_id,
      text,
      file: fileName,
      created_at: new Date()
    });

    res.json({ message: 'Konten galeri berhasil ditambahkan.', galeri });
  } catch (error) {
    console.error('Error createGaleri:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
};

exports.getGaleri = async (req, res) => {
  try {
    const galeri = await Galeri.findAll({
      include: [{ model: User, attributes: ['name', 'studentId'] }],
      order: [['created_at', 'DESC']],
    });

    // Format ulang data agar frontend bisa langsung baca student_name
    const response = galeri.map(item => ({
      id: item.id,
      student_id: item.student_id,
      student_name: item.User ? item.User.name : 'Tidak diketahui',
      text: item.text,
      file: item.file,
      created_at: item.created_at
    }));

    res.json(response);
  } catch (error) {
    console.error('Error saat mengambil galeri:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server saat mengambil galeri.' });
  }
};

exports.updateGaleri = async (req, res) => {
  try {
    const id = req.params.id;
    const { text } = req.body;
    await Galeri.update({ text }, { where: { id } });
    res.json({ message: 'Konten galeri berhasil diupdate.' });
  } catch (error) {
    console.error('Error saat update galeri:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server saat update galeri.' });
  }
};

exports.deleteGaleri = async (req, res) => {
  try {
    const id = req.params.id;
    await Galeri.destroy({ where: { id } });
    res.json({ message: 'Konten galeri berhasil dihapus.' });
  } catch (error) {
    console.error('Error saat hapus galeri:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server saat hapus galeri.' });
  }
};

// Fungsi komentar sesuai kebutuhan
// Membuat komentar baru pada galeri
exports.createKomentar = async (req, res) => {
  try {
    const galeri_id = req.params.id; // harus 'id', sesuai route
    const { student_id, text } = req.body;

    if (!student_id || !text) {
      return res.status(400).json({ error: 'Student ID dan teks komentar wajib diisi.' });
    }

    const galeriExists = await Galeri.findByPk(galeri_id);
    if (!galeriExists) {
      return res.status(404).json({ error: 'Galeri tidak ditemukan.' });
    }

    const komentar = await KomentarGaleri.create({
      galeri_id,
      student_id,
      text,
      created_at: new Date(),
    });

    res.json({ message: 'Komentar berhasil ditambahkan.', komentar });
  } catch (error) {
    console.error('Error createKomentar:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server saat menambahkan komentar.' });
  }
};

// Mengambil komentar pada galeri tertentu
exports.getKomentar = async (req, res) => {
  try {
    const galeri_id = req.params.id;  // Sesuaikan nama paramnya 'id', bukan 'galeriId'

    const komentar = await KomentarGaleri.findAll({
      where: { galeri_id },
      include: [
        {
          model: User, // Model yang menyimpan data user/student
          attributes: ['name'], // Ambil nama saja
        }
      ],
      order: [['created_at', 'ASC']]
    });

    // Format response supaya frontend dapat student_name
    const formattedKomentar = komentar.map(k => ({
      id: k.id,
      galeri_id: k.galeri_id,
      student_id: k.student_id,
      text: k.text,
      created_at: k.created_at,
      student_name: k.User ? k.User.name : 'Tidak diketahui'
    }));

    res.json(formattedKomentar);
  } catch (error) {
    console.error('Error getKomentar:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server saat mengambil komentar.' });
  }
};

// Menghapus komentar dari galeri
exports.deleteKomentar = async (req, res) => {
  try {
    const komentarId = req.params.id;
    const { user_role, student_id } = req.query;

    const komentar = await KomentarGaleri.findByPk(komentarId);

    if (!komentar) {
      return res.status(404).json({ error: 'Komentar tidak ditemukan.' });
    }

    // Cek izin hapus
    if (user_role !== 'admin' && komentar.student_id !== student_id) {
      return res.status(403).json({ error: 'Anda tidak punya izin menghapus komentar ini.' });
    }

    await komentar.destroy();

    res.json({ message: 'Komentar berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleteKomentar:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server saat menghapus komentar.' });
  }
};
