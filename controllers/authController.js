const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { Op } = require('sequelize');

// Register user
exports.register = async (req, res) => {
  try {
    const { name, class: className, studentId, email, password, role } = req.body;

    console.log('Received request body:', req.body);  // Log the incoming request body

    // Validate input
    if (!name || !className || !studentId || !email || !password || !role) {
      return res.status(400).json({ error: 'Semua field harus diisi.' });
    }

    // Check if studentId or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ studentId }, { email }],
      },
    });

    if (existingUser) {
      console.log(`Existing user found: ${existingUser}`);  // Log the existing user
      return res.status(400).json({ error: 'Email atau Student ID sudah digunakan.' });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      class: className,
      studentId,
      email,
      password: hash,
      role,
    });

    res.json({ message: 'Register berhasil', userId: user.id });
  } catch (err) {
    console.error('Register error:', err);  // Log any errors
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email dan password harus diisi' });

    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: 'Password salah' });

    res.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        studentId: user.studentId,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
};
