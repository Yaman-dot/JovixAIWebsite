"use server"

import mysql from "mysql2/promise"
import crypto from "crypto"

// Database connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "jovixai_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create a connection pool
let pool: mysql.Pool | null = null

// Initialize the pool
const getPool = async () => {
  if (!pool) {
    console.log("Creating database pool with config:", {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      // Not logging password for security reasons
      hasPassword: !!dbConfig.password,
    })
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

    // Handle specific database errors
    if (error instanceof Error) {
      const mysqlError = error as any

      // Handle "table doesn't exist" errors by attempting to initialize the database
      if (mysqlError.code === "ER_NO_SUCH_TABLE") {
        console.log("Table doesn't exist, attempting to initialize database...")
        try {
          await initDatabase()

          // Retry the query after initialization
          const pool = await getPool()
          const [results] = await pool.execute(sql, params)
          return results
        } catch (initError) {
          console.error("Failed to initialize database:", initError)
          throw new Error(
            `Database initialization failed: ${initError instanceof Error ? initError.message : "Unknown error"}`,
          )
        }
      }

      // Handle connection errors
      if (mysqlError.code === "ECONNREFUSED" || mysqlError.code === "ER_ACCESS_DENIED_ERROR") {
        throw new Error("Database connection failed. Please check your database configuration.")
      }
    }

    // Rethrow with a more user-friendly message
    throw new Error(`Database operation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Initialize database tables if they don't exist
export async function initDatabase() {
  try {
    // Check if we can connect to the database first
    try {
      await query("SELECT 1")
      console.log("Database connection successful")
    } catch (connectionError) {
      // If the error is not about missing tables, rethrow it
      if ((connectionError as any)?.code !== "ER_NO_SUCH_TABLE") {
        throw connectionError
      }
    }

    // Create users table with better error handling
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'editor', 'user') DEFAULT 'user',
          profile_image VARCHAR(255) DEFAULT '/images/default-avatar.png',
          bio TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)
      console.log("Users table created or already exists")
    } catch (error) {
      console.error("Error creating users table:", error)
      throw error
    }

    // Create blog_posts table
    try {
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
      console.log("Blog posts table created or already exists")
    } catch (error) {
      console.error("Error creating blog_posts table:", error)
      // Continue with other tables even if this one fails
    }

    // Create services table
    try {
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
      console.log("Services table created or already exists")
    } catch (error) {
      console.error("Error creating services table:", error)
      // Continue with other tables
    }

    // Create portfolio_items table
    try {
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
      console.log("Portfolio items table created or already exists")
    } catch (error) {
      console.error("Error creating portfolio_items table:", error)
      // Continue with other tables
    }

    // Create user_sessions table for authentication
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          session_token VARCHAR(255) NOT NULL UNIQUE,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `)
      console.log("User sessions table created or already exists")
    } catch (error) {
      console.error("Error creating user_sessions table:", error)
      // Continue with other tables
    }

    // Create user_activity_log table
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS user_activity_log (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          action VARCHAR(100) NOT NULL,
          details TEXT,
          ip_address VARCHAR(45),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )
      `)
      console.log("User activity log table created or already exists")
    } catch (error) {
      console.error("Error creating user_activity_log table:", error)
      // Continue with other tables
    }

    // Create oauth_accounts table for social logins
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS oauth_accounts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          provider VARCHAR(50) NOT NULL,
          provider_user_id VARCHAR(255) NOT NULL,
          access_token TEXT,
          refresh_token TEXT,
          expires_at TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY provider_user_id_unique (provider, provider_user_id)
        )
      `)
      console.log("OAuth accounts table created or already exists")
    } catch (error) {
      console.error("Error creating oauth_accounts table:", error)
      // Continue with other tables
    }

    console.log("Database initialized successfully")

    // Check if admin user exists, if not create one
    try {
      const adminExists = await query("SELECT * FROM users WHERE role = ?", ["admin"])

      if (Array.isArray(adminExists) && adminExists.length === 0) {
        // Create default admin user with hashed password
        const hashedPassword = crypto.createHash("sha256").update("admin123").digest("hex")

        await query("INSERT INTO users (name, email, password, role, profile_image) VALUES (?, ?, ?, ?, ?)", [
          "Admin User",
          "admin@jovixai.com",
          hashedPassword,
          "admin",
          "/images/default-avatar.png",
        ])
        console.log("Default admin user created")
      }
    } catch (error) {
      console.error("Error checking/creating admin user:", error)
      // This is not critical, so we can continue
    }

    return { success: true, message: "Database initialized successfully" }
  } catch (error) {
    console.error("Database initialization error:", error)
    return {
      success: false,
      error: `Failed to initialize database: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

