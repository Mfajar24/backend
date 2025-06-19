// controllers/userController.js
const { User } = require('../models');

// GET semua pengguna
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'class', 'studentId', 'email', 'role'] // Gunakan studentId di sini
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET satu pengguna
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'class', 'studentId', 'email', 'role'] // Gunakan studentId di sini
    });
    if (!user) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT (update) pengguna
exports.updateUser = async (req, res) => {
  const { name, class: className, studentId, email, role } = req.body;

  try {
    // Cek apakah studentId sudah ada pada pengguna lain
    const existingStudentId = await User.findOne({ where: { studentId } });
    if (existingStudentId && existingStudentId.id !== parseInt(req.params.id)) {
      return res.status(400).json({ error: 'studentId sudah digunakan oleh pengguna lain' });
    }

    // Cek apakah email sudah ada pada pengguna lain
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail && existingEmail.id !== parseInt(req.params.id)) {
      return res.status(400).json({ error: 'Email sudah digunakan oleh pengguna lain' });
    }

    // Melakukan update
    const updated = await User.update({
      name,
      class: className,
      studentId, 
      email,
      role
    }, {
      where: { id: req.params.id }
    });

    if (updated[0] === 0) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan atau tidak ada perubahan' });
    }

    res.json({ message: 'Pengguna berhasil diperbarui' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
};
// DELETE pengguna
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
