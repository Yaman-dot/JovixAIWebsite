"use server"

import { initDatabase } from "../db"
import { getAllUsers } from "../models/user"
import { getAllBlogPosts } from "../models/blog"
import { getAllServices } from "../models/service"
import { getAllPortfolioItems } from "../models/portfolio"

export async function initDatabaseAction() {
  try {
    await initDatabase()
    return { success: true }
  } catch (error) {
    console.error("Error initializing database:", error)
    return { success: false, error: "Failed to initialize database" }
  }
}

export async function fetchStats() {
  try {
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
    return { success: false, error: "Failed to fetch stats" }
  }
}

