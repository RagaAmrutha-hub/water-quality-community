const mysql = require('mysql2/promise');
require('dotenv').config();

// Create securely dynamic pool prioritizing Cloud URI Injection
const pool = mysql.createPool(
    process.env.DATABASE_URL || {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'amrutha_5', // Fallback for local
        database: process.env.DB_NAME || 'water_quality_db',
        waitForConnections: true,
        connectionLimit: 10
    }
);

async function initDB() {
    try {
        // Execute each CREATE TABLE separately (FIXES syntax error)
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reg_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Drop broken legacy tables
        await pool.execute(`DROP TABLE IF EXISTS water_readings`);
        await pool.execute(`DROP TABLE IF EXISTS complaints`);

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS water_readings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                color VARCHAR(50) NOT NULL,
                temperature DECIMAL(5,2) NOT NULL,
                taste VARCHAR(50) NOT NULL,
                status ENUM('SAFE','UNSAFE') DEFAULT 'UNSAFE',
                ph VARCHAR(50) NOT NULL,
                turbidity VARCHAR(50) NOT NULL,
                recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS complaints (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                photo_path VARCHAR(500),
                status ENUM('pending','resolved') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        const bcrypt = require('bcryptjs');

        // create admin user
        const hash = await bcrypt.hash('admin123', 10);
        // Add demo admin user
        await pool.execute(
            `INSERT IGNORE INTO users (reg_number, name, password_hash, role)
   VALUES ('ADMIN01', 'Admin', ?, 'admin')`,
            [hash]
        );

        console.log('✅ Database & Tables created successfully!');
    } catch (error) {
        console.error('❌ DB Init Error:', error.code, error.message);
        throw error;
    }
}

module.exports = { pool, initDB };