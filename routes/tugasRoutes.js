const express = require('express');
const router = express.Router();
const controller = require('../controllers/tugasController');
const uploadTugas = require('../config/multer');
const upload = require('../config/multer');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', uploadTugas.single('file'), controller.create);
router.put('/:id', uploadTugas.single('file'), controller.update);
router.delete('/:id', controller.remove);

// komentar
router.post('/:id/komentar', controller.addKomentar);
router.get('/:id/komentar', controller.getKomentar);
router.delete('/komentar/:id', controller.deleteKomentar);

// views
router.post('/:id/view', controller.addView);
router.get('/:id/views', controller.getViews);

module.exports = router;
