"use server"

import { initDatabase } from "../db"
import { getAllUsers } from "../models/user"
import { getAllBlogPosts } from "../models/blog"
import { getAllServices } from "../models/service"
import { getAllPortfolioItems } from "../models/portfolio"
import { query } from "../db"

export async function initDatabaseAction() {
  try {
    // Check if database connection is possible
    try {
      // Try a simple query first to test connection
      // @ts-expect-error
      await query("SELECT 1")
      console.log("Database connection successful")
    } catch (connectionError) {
      console.error("Database connection failed:", connectionError)
      return {
        success: false,
        error: `Database connection failed: ${connectionError instanceof Error ? connectionError.message : "Unknown error"}`,
      }
    }

    await initDatabase()
    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return {
      success: false,
      error: `Failed to initialize database: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function fetchStats() {
  try {
    try {
      // Try a simple query first to test connection
      // @ts-expect-error
      await query("SELECT 1")
    } catch (connectionError) {
      console.error("Database connection failed:", connectionError)
      // Return mock data for development purposes
      return {
        success: true,
        data: {
          users: 0,
          blogPosts: 0,
          services: 0,
          portfolioItems: 0,
        },
        mockData: true,
      }
    }

    // Fetch counts from database
    const users = await getAllUsers()
    const blogPosts = await getAllBlogPosts()
    const services = await getAllServices()
    const portfolioItems = await getAllPortfolioItems()

    return {
      success: true,
      data: {
        users: Array.isArray(users) ? users.length : 0,
        blogPosts: Array.isArray(blogPosts) ? blogPosts.length : 0,
        services: Array.isArray(services) ? services.length : 0,
        portfolioItems: Array.isArray(portfolioItems) ? portfolioItems.length : 0,
      },
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      success: false,
      error: `Failed to fetch stats: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

