const Comment = require('../models/comment');
const User = require('../models/User'); // Import model User untuk include
const xss = require('xss'); // Import pustaka untuk sanitasi input

// Menambahkan komentar ke kursus
exports.addComment = async (req, res) => {
    const { student_id, text } = req.body;
    const course_id = req.params.id;

    try {
        // Sanitasi teks komentar menggunakan xss untuk menghindari HTML/JS yang berbahaya
        const sanitizedText = xss(text);  // Ini akan menghapus atau mengonversi HTML menjadi teks biasa

        const comment = await Comment.create({
            course_id,
            student_id,
            text: sanitizedText  // Simpan komentar yang sudah disanitasi
        });

        res.json({ message: 'Komentar berhasil ditambahkan', commentId: comment.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mendapatkan komentar dari kursus
exports.getComments = async (req, res) => {
    const course_id = req.params.id;

    try {
        const comments = await Comment.findAll({
            where: { course_id },
            include: [{
                model: User,
                attributes: ['name']  // Ambil data nama user (atau atribut lain yang diperlukan)
            }]
        });

        // Format response agar frontend mudah pakai student_name
        const commentsFormatted = comments.map(c => ({
            id: c.id,
            text: c.text,  // Komentar sudah disanitasi di backend
            student_name: c.User ? c.User.name : 'Unknown',
            student_id: c.student_id,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt
        }));

        res.json(commentsFormatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Menghapus komentar
exports.deleteComment = async (req, res) => {
    const commentId = req.params.commentId;
    const { user_id, role } = req.body;  // user info dikirim di body request

    try {
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Komentar tidak ditemukan' });
        }

        // Cek apakah user adalah admin atau pemilik komentar
        if (role !== 'admin' && comment.student_id !== user_id) {
            return res.status(403).json({ error: 'Anda tidak berhak menghapus komentar ini' });
        }

        await comment.destroy();

        res.json({ message: 'Komentar berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
