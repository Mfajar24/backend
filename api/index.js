const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('../config/db');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const courseRoutes = require('../routes/courseRoute');
const tugasRoutes = require('../routes/tugasRoutes');
const jawabanRoutes = require('../routes/jawabanRoutes');
const galeriRoutes = require('../routes/galeriRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running, Database connected");
});

// Static assets (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api/tugas', tugasRoutes);
app.use('/api', jawabanRoutes);
app.use('/galeri', galeriRoutes);
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));

// Sync DB (once, can be removed later in production)
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
}).catch(err => {
  console.error('Database connection error:', err);
});

// ❗ Penting: Jangan gunakan `app.listen` di Vercel!
// Cukup export app:
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
