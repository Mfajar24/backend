const express = require('express');
const router = express.Router();
const galeriController = require('../controllers/galeriController');
const upload = require('../config/multer'); // Jika menggunakan multer untuk upload file

// Galeri
router.post('/', upload.single('file'), galeriController.createGaleri);
router.get('/', galeriController.getGaleri);
router.put('/:id', galeriController.updateGaleri);
router.delete('/:id', galeriController.deleteGaleri);

// Komentar Galeri
router.post('/:id/komentar', galeriController.createKomentar);
router.get('/:id/komentar', galeriController.getKomentar);
router.delete('/komentar/:id', galeriController.deleteKomentar);

module.exports = router;
