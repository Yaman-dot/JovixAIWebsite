"use server"

import mysql from "mysql2/promise"

// Database connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "ai_vision_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create a connection pool
let pool: mysql.Pool | null = null

// Initialize the pool
const getPool = async () => {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

// Helper function to execute SQL queries
export async function query(sql: string, params: any[] = []) {
  try {
    const pool = await getPool()
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Initialize database tables if they don't exist
export async function initDatabase() {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'editor', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Create blog_posts table
    await query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        excerpt TEXT,
        content LONGTEXT,
        author_id INT,
        category VARCHAR(100),
        image_url VARCHAR(255),
        status ENUM('draft', 'published') DEFAULT 'draft',
        published_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)

    // Create services table
    await query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(50),
        features JSON,
        use_cases JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Create portfolio_items table
    await query(`
      CREATE TABLE IF NOT EXISTS portfolio_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        full_description TEXT,
        client VARCHAR(255),
        image_url VARCHAR(255),
        tags JSON,
        category VARCHAR(100),
        results JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    console.log("Database initialized successfully")

    // Check if admin user exists, if not create one
    const adminExists = await query("SELECT * FROM users WHERE role = ?", ["admin"])

    if (Array.isArray(adminExists) && adminExists.length === 0) {
      // Create default admin user (in production, use a secure password and store hashed)
      await query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
        "Admin User",
        "admin@aivision.com",
        "admin123",
        "admin",
      ])
      console.log("Default admin user created")
    }
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}

