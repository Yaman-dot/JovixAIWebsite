"use server"
import mysql from "mysql2/promise"

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
    throw new Error(`Database operation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

