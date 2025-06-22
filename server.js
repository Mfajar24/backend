const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoute');
const tugasRoutes = require('./routes/tugasRoutes');
const jawabanRoutes = require('./routes/jawabanRoutes');
const galeriRoutes = require('./routes/galeriRoutes');


const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors());  // Enable CORS
app.use(express.json());  // Use express built-in JSON parser

// Register routes
app.use('/api', authRoutes);  // Route for authentication
app.use('/api', userRoutes);  // Route for user management
app.use('/api', courseRoutes);  // Route for courses
app.use('/api/tugas', tugasRoutes);
app.use('/api', jawabanRoutes);
app.use('/galeri', galeriRoutes);


app.use('/js', express.static(path.join(__dirname, 'frontend/js')));

sequelize.sync({ force: true })
  .then(() => {
    console.log('Database synced');
    app.listen(5000, () => console.log('Server started on http://localhost:5000'));
  })
  .catch(err => console.error('Unable to connect to database:', err));
