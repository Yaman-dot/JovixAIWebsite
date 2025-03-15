"use server"

import { revalidatePath } from "next/cache"
import {
  getAllPortfolioItems,
  getPortfolioItemById,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  type PortfolioItem,
} from "../models/portfolio"

export async function fetchAllPortfolioItems() {
  try {
    const items = await getAllPortfolioItems()

    // Parse JSON fields
    const parsedItems = items.map((item: any) => ({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
      results: item.results ? JSON.parse(item.results) : [],
    }))

    return { success: true, data: parsedItems }
  } catch (error) {
    console.error("Error fetching portfolio items:", error)
    return { success: false, error: "Failed to fetch portfolio items" }
  }
}

export async function fetchPortfolioItemById(id: number) {
  try {
    const item = await getPortfolioItemById(id)
    if (!item) {
      return { success: false, error: "Portfolio item not found" }
    }

    return { success: true, data: item }
  } catch (error) {
    console.error("Error fetching portfolio item:", error)
    return { success: false, error: "Failed to fetch portfolio item" }
  }
}

export async function createNewPortfolioItem(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const full_description = formData.get("full_description") as string
    const client = formData.get("client") as string
    const image_url = formData.get("image_url") as string
    const category = formData.get("category") as string

    // Handle tags as a JSON array
    const tagsJson = formData.get("tags") as string
    const tags = tagsJson ? JSON.parse(tagsJson) : []

    // Handle results as a JSON array
    const resultsJson = formData.get("results") as string
    const results = resultsJson ? JSON.parse(resultsJson) : []

    // Validate required fields
    if (!title) {
      return { success: false, error: "Title is required" }
    }

    const item: PortfolioItem = {
      title,
      description,
      full_description,
      client,
      image_url,
      tags,
      category,
      results,
    }

    await createPortfolioItem(item)
    revalidatePath("/admin/portfolio")
    revalidatePath("/portfolio")
    return { success: true, message: "Portfolio item created successfully" }
  } catch (error) {
    console.error("Error creating portfolio item:", error)
    return { success: false, error: "Failed to create portfolio item" }
  }
}

export async function updateExistingPortfolioItem(id: number, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const full_description = formData.get("full_description") as string
    const client = formData.get("client") as string
    const image_url = formData.get("image_url") as string
    const category = formData.get("category") as string

    // Handle tags as a JSON array
    const tagsJson = formData.get("tags") as string
    const tags = tagsJson ? JSON.parse(tagsJson) : []

    // Handle results as a JSON array
    const resultsJson = formData.get("results") as string
    const results = resultsJson ? JSON.parse(resultsJson) : []

    // Validate required fields
    if (!title) {
      return { success: false, error: "Title is required" }
    }

    const item: PortfolioItem = {
      title,
      description,
      full_description,
      client,
      image_url,
      tags,
      category,
      results,
    }

    await updatePortfolioItem(id, item)
    revalidatePath("/admin/portfolio")
    revalidatePath("/portfolio")
    return { success: true, message: "Portfolio item updated successfully" }
  } catch (error) {
    console.error("Error updating portfolio item:", error)
    return { success: false, error: "Failed to update portfolio item" }
  }
}

export async function deletePortfolioItemById(id: number) {
  try {
    await deletePortfolioItem(id)
    revalidatePath("/admin/portfolio")
    revalidatePath("/portfolio")
    return { success: true, message: "Portfolio item deleted successfully" }
  } catch (error) {
    console.error("Error deleting portfolio item:", error)
    return { success: false, error: "Failed to delete portfolio item" }
  }
}

