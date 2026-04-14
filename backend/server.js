require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

// ✅ FIRST create app
const app = express();
const PORT = process.env.PORT || 4000;

// ✅ THEN import routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const waterRoutes = require('./routes/water');
const complaintsRoutes = require('./routes/complaints');
const statsRoutes = require('./routes/stats');

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/stats', statsRoutes);

// Start server
db.initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
  });
});