const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const commentController = require('../controllers/commentController');
const upload = require('../config/multer'); // Jika menggunakan multer untuk upload file

// Kursus
router.get('/courses', courseController.getCourses);
router.post('/courses', upload.array('files', 5), courseController.createCourse);
router.put('/courses/:id', upload.array('files', 5), courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);

// Komentar pada kursus
router.post('/courses/:id/komentar', commentController.addComment);
router.get('/courses/:id/komentar', commentController.getComments);
router.delete('/courses/komentar/:id', commentController.deleteComment);

// Route baru untuk record view
router.post('/courses/:id/view', courseController.recordView);
// Mendapatkan semua view
router.get('/courses/:id/views', courseController.getCourseViews);
module.exports = router;
