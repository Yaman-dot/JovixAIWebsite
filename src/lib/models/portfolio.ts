"use server"

import { query } from "../db"

export interface PortfolioItem {
  id?: number
  title: string
  description?: string
  full_description?: string
  client?: string
  image_url?: string
  tags?: string[]
  category?: string
  results?: string[]
  created_at?: Date
  updated_at?: Date
}

export async function getAllPortfolioItems() {
  return await query("SELECT * FROM portfolio_items ORDER BY created_at DESC")
}

export async function getPortfolioItemById(id: number) {
  const results = await query("SELECT * FROM portfolio_items WHERE id = ?", [id])

  // Parse JSON fields
  if (results[0]) {
    results[0].tags = JSON.parse(results[0].tags || "[]")
    results[0].results = JSON.parse(results[0].results || "[]")
  }

  return results[0]
}

export async function createPortfolioItem(item: PortfolioItem) {
  const { title, description, full_description, client, image_url, tags, category, results } = item

  // Convert arrays to JSON strings for storage
  const tagsJson = tags ? JSON.stringify(tags) : "[]"
  const resultsJson = results ? JSON.stringify(results) : "[]"

  const result = await query(
    `INSERT INTO portfolio_items 
     (title, description, full_description, client, image_url, tags, category, results) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description, full_description, client, image_url, tagsJson, category, resultsJson],
  )

  return result
}

export async function updatePortfolioItem(id: number, item: PortfolioItem) {
  const { title, description, full_description, client, image_url, tags, category, results } = item

  // Convert arrays to JSON strings for storage
  const tagsJson = tags ? JSON.stringify(tags) : "[]"
  const resultsJson = results ? JSON.stringify(results) : "[]"

  const result = await query(
    `UPDATE portfolio_items 
     SET title = ?, description = ?, full_description = ?, client = ?, 
         image_url = ?, tags = ?, category = ?, results = ?
     WHERE id = ?`,
    [title, description, full_description, client, image_url, tagsJson, category, resultsJson, id],
  )

  return result
}

export async function deletePortfolioItem(id: number) {
  const result = await query("DELETE FROM portfolio_items WHERE id = ?", [id])
  return result
}

export async function getPortfolioCategories() {
  const results = await query("SELECT DISTINCT category FROM portfolio_items WHERE category IS NOT NULL")
  return results
}

