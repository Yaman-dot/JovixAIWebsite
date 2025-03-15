"use server"

import { query } from "../db"

export interface BlogPost {
  id?: number
  title: string
  slug: string
  excerpt?: string
  content?: string
  author_id?: number
  category?: string
  image_url?: string
  status?: "draft" | "published"
  published_at?: Date | null
  created_at?: Date
  updated_at?: Date
}

export async function getAllBlogPosts() {
  return await query(`
    SELECT b.*, u.name as author_name 
    FROM blog_posts b
    LEFT JOIN users u ON b.author_id = u.id
    ORDER BY b.created_at DESC
  `)
}

export async function getBlogPostById(id: number) {
  const results = await query(
    `SELECT b.*, u.name as author_name 
     FROM blog_posts b
     LEFT JOIN users u ON b.author_id = u.id
     WHERE b.id = ?`,
    [id],
  )

  return results[0]
}

export async function getBlogPostBySlug(slug: string) {
  const results = await query(
    `SELECT b.*, u.name as author_name 
     FROM blog_posts b
     LEFT JOIN users u ON b.author_id = u.id
     WHERE b.slug = ?`,
    [slug],
  )

  return results[0]
}

export async function createBlogPost(post: BlogPost) {
  const { title, slug, excerpt, content, author_id, category, image_url, status } = post

  const published_at = status === "published" ? new Date() : null

  const result = await query(
    `INSERT INTO blog_posts 
     (title, slug, excerpt, content, author_id, category, image_url, status, published_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, slug, excerpt, content, author_id, category, image_url, status, published_at],
  )

  return result
}

export async function updateBlogPost(id: number, post: BlogPost) {
  const { title, slug, excerpt, content, author_id, category, image_url, status } = post

  // If status is changing to published and it wasn't before, set published_at
  let published_at = null
  if (status === "published") {
    const currentPost = await getBlogPostById(id)
    if (currentPost.status !== "published") {
      published_at = new Date()
    } else {
      published_at = currentPost.published_at
    }
  }

  const result = await query(
    `UPDATE blog_posts 
     SET title = ?, slug = ?, excerpt = ?, content = ?, author_id = ?, 
         category = ?, image_url = ?, status = ?, published_at = ?
     WHERE id = ?`,
    [title, slug, excerpt, content, author_id, category, image_url, status, published_at, id],
  )

  return result
}

export async function deleteBlogPost(id: number) {
  const result = await query("DELETE FROM blog_posts WHERE id = ?", [id])
  return result
}

export async function getBlogCategories() {
  const results = await query("SELECT DISTINCT category FROM blog_posts WHERE category IS NOT NULL")
  return results
}

