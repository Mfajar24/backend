const multer = require('multer');
const path = require('path');

// Menentukan penyimpanan file (misalnya di folder 'uploads')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Menentukan folder tempat file akan disimpan
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    // Menentukan nama file yang disimpan
    cb(null, Date.now() + path.extname(file.originalname)); // Menambahkan timestamp untuk menghindari nama file yang sama
  }
});

// File filter untuk memvalidasi format file yang diterima
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp',

    'video/mp4', 
    'video/quicktime', 
    'video/x-msvideo',     // avi
    'video/x-matroska',    // mkv

    // Variasi MIME type PDF
    'application/pdf',
    'application/x-pdf',
    'application/acrobat',
    'applications/vnd.pdf',
    'application/vnd.pdf',

    'application/msword',  // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx

    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx

    'application/vnd.ms-powerpoint',  // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx

    'text/plain',  // .txt
  ];

  console.log('Uploading file:', file.originalname, 'MIME type:', file.mimetype);

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Format file tidak didukung: ${file.mimetype}`), false);
  }
};

// Membuat instance Multer dengan konfigurasi storage dan fileFilter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Middleware untuk handle upload + error
const uploadMiddleware = (fieldName) => (req, res, next) => {
  const uploader = upload.single(fieldName);

  uploader(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Multer error seperti limit file size exceeded dll
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Error lain (misal fileFilter error)
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};


module.exports = upload;
