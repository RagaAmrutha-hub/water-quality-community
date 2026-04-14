const express = require('express');
const db = require('../config/db');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get notifications (recent unsafe readings + pending complaints)
router.get('/', auth, (req, res) => {
  db.pool.execute(`
    SELECT 'reading' as type, status, recorded_at as time, 'Unsafe water detected!' as message 
    FROM water_readings 
    WHERE user_id = ? AND status = 'UNSAFE' AND recorded_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
    UNION ALL
    SELECT 'complaint' as type, status, created_at as time, CONCAT(title, ' - ', status) as message
    FROM complaints 
    WHERE user_id = ? AND status != 'Completed' AND created_at > DATE_SUB(NOW(), INTERVAL 7 DAY)
    ORDER BY time DESC LIMIT 10
  `, [req.user.id, req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(results);
  });
});

module.exports = router;