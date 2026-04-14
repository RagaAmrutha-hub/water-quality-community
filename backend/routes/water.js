const express = require('express');
const db = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

/* 🔍 WATER EVALUATION LOGIC */
function evaluateWater(color, temperature, taste) {
  let safe = true;
  let reasons = [];

  const unsafeColors = ['brown', 'black', 'yellow', 'dirty'];
  const unsafeTastes = ['salty', 'metallic', 'bitter', 'chlorine'];

  color = color.toLowerCase();
  taste = taste.toLowerCase();

  if (unsafeColors.includes(color)) {
    safe = false;
    reasons.push('Water color indicates contamination');
  }

  if (temperature > 45) {
    safe = false;
    reasons.push('Temperature should not exceed 45°C');
  }

  if (temperature < 5) {
    safe = false;
    reasons.push('Temperature too low');
  }

  if (unsafeTastes.includes(taste)) {
    safe = false;
    reasons.push('Unusual taste detected');
  }

  return {
    status: safe ? 'SAFE' : 'UNSAFE',
    reasons
  };
}

/* 🚀 ADD READING */
router.post('/', auth, async (req, res) => {
  try {
    let { color, temperature, taste, ph, turbidity } = req.body;

    if (!color || !temperature || !taste || !ph || !turbidity) {
      return res.status(400).json({ message: 'All fields required' });
    }

    temperature = Number(temperature);

    const result = evaluateWater(color, temperature, taste);

    await db.pool.execute(
      'INSERT INTO water_readings (user_id, color, temperature, taste, status, ph, turbidity) VALUES (?,?,?,?,?,?,?)',
      [req.user.id, color, temperature, taste, result.status, ph.toString(), turbidity.toString()]
    );

    res.json({
      success: true,
      status: result.status,
      reasons: result.reasons
    });

  } catch (err) {
    console.error('SQL Error inserting water reading:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

/* 📊 GET READINGS */
router.get('/', auth, async (req, res) => {
  try {
    const [results] = await db.pool.execute(
      'SELECT color, temperature, taste, status, ph, turbidity, recorded_at FROM water_readings WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 20',
      [req.user.id]
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'DB error' });
  }
});

module.exports = router;