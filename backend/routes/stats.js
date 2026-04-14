const express = require('express');
const db = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        // 1. Total Readings
        const [totalRows] = await db.pool.execute('SELECT COUNT(*) as count FROM water_readings');
        const totalReadings = totalRows[0].count;

        // 2. Safe Readings
        const [safeRows] = await db.pool.execute('SELECT COUNT(*) as count FROM water_readings WHERE status = "SAFE"');
        const safeReadings = safeRows[0].count;

        // 3. Active Complaints
        const [complaintsRows] = await db.pool.execute('SELECT COUNT(*) as count FROM complaints WHERE status != "Completed"');
        const activeComplaints = complaintsRows[0].count;

        res.json({
            success: true,
            stats: {
                totalReadings,
                safeReadings,
                activeComplaints
            }
        });
    } catch (err) {
        console.error('Stats Error:', err);
        res.status(500).json({ success: false, message: 'Server error retrieving stats' });
    }
});

module.exports = router;
