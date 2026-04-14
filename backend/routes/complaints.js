const express = require('express');
const db = require('../config/db');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads folder exists in cloud environments
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + Math.round(Math.random()*1e9) + path.extname(file.originalname))
});

const upload = multer({ storage });

// Create complaint
router.post('/', auth, upload.single('photo'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const photo_path = req.file ? req.file.filename : null;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description required' });
    }

    await db.pool.execute(
      'INSERT INTO complaints (user_id, title, description, photo_path) VALUES (?,?,?,?)',
      [req.user.id, title, description, photo_path]
    );

    res.json({ message: 'Complaint submitted' });
  } catch (err) {
    console.error('Complaint POST Error:', err);
    res.status(500).json({ message: 'DB error', error: err.message });
  }
});

// Get complaints for current user
router.get('/mine', auth, async (req, res) => {
  try {
    const [results] = await db.pool.execute(
      'SELECT id, title, description, status, photo_path, DATE_FORMAT(created_at, "%Y-%m-%d") as date FROM complaints WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(results);
  } catch (err) {
    console.error('Complaint GET Error:', err);
    res.status(500).json({ message: 'DB error' });
  }
});

// Admin: list all complaints
router.get('/all', auth, (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });

  db.pool.execute(
    'SELECT c.*, u.reg_number FROM complaints c JOIN users u ON c.user_id = u.id ORDER BY created_at DESC',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(results);
    }
  );
});

// Admin: update status
router.put('/:id/status', auth, (req, res) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });

  const { status } = req.body;
  db.pool.execute(
    'UPDATE complaints SET status = ? WHERE id = ?',
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ message: 'Status updated' });
    }
  );
});

module.exports = router;
