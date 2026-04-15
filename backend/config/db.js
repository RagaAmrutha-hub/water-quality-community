const mysql = require('mysql2/promise');
require('dotenv').config();

function getPoolConfig() {
    if (process.env.DATABASE_URL) {
        try {
            const url = new URL(process.env.DATABASE_URL);
            return {
                host: url.hostname,
                port: parseInt(url.port) || 3306,
                user: url.username,
                password: url.password,
                database: url.pathname.slice(1),
                waitForConnections: true,
                connectionLimit: 10,
                enableKeepAlive: true,
                keepAliveInitialDelayMs: 0,
                ssl: 'amazon'  // Enable SSL for Aiven
            };
        } catch (e) {
            console.error('❌ Invalid DATABASE_URL format:', e.message);
            throw e;
        }
    }
    
    return {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'water_quality_db',
        waitForConnections: true,
        connectionLimit: 10
    };
}

const pool = mysql.createPool(getPoolConfig());

async function initDB() {
    try {
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

        console.log('✅ Database & Tables created successfully!');
    } catch (error) {
        console.error('❌ DB Init Error:', error.code, error.message);
        throw error;
    }
}

module.exports = { pool, initDB };