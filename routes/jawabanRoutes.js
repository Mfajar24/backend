const express = require('express');
const router = express.Router();
const upload = require('../config/multer'); // pakai multer config yang kamu buat
const jawabanController = require('../controllers/jawabanController');

router.post('/jawaban', upload.single('file'), jawabanController.createJawaban);
router.put('/jawaban/:id', upload.single('file'), jawabanController.editJawaban);
router.get('/jawaban/cek/:task_id/:student_id', jawabanController.cekJawaban);
router.get('/jawaban', jawabanController.getAllJawaban);
router.put('/jawaban/:id/nilai', jawabanController.nilaiJawaban);
router.get('/laporan-nilai', jawabanController.laporanNilai);

module.exports = router;
