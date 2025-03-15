"use server"

import { revalidatePath } from "next/cache"
import {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  type BlogPost,
} from "../models/blog"
import { query } from "../config/db"

export async function fetchAllBlogPosts() {
  try {
    const posts = await getAllBlogPosts()
    return { success: true, data: posts }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return { success: false, error: "Failed to fetch blog posts" }
  }
}

export async function fetchBlogPostById(id: number) {
  try {
    const post = await getBlogPostById(id)
    if (!post) {
      return { success: false, error: "Blog post not found" }
    }
    return { success: true, data: post }
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return { success: false, error: "Failed to fetch blog post" }
  }
}

export async function createNewBlogPost(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const author_id = Number.parseInt(formData.get("author_id") as string)
    const category = formData.get("category") as string
    const image_url = formData.get("image_url") as string
    const status = formData.get("status") as "draft" | "published"

    // Validate required fields
    if (!title || !slug) {
      return { success: false, error: "Title and slug are required" }
    }

    // Get the current user to use as author if author_id is not valid
    let finalAuthorId = author_id
    if (isNaN(finalAuthorId) || finalAuthorId <= 0) {
      try {
        // Get the first admin user as a fallback
        const adminUsers = await query("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
        if (Array.isArray(adminUsers) && adminUsers.length > 0) {
          finalAuthorId = adminUsers[0].id
        } else {
          // If no admin users, get any user
          const anyUsers = await query("SELECT id FROM users LIMIT 1")
          if (Array.isArray(anyUsers) && anyUsers.length > 0) {
            finalAuthorId = anyUsers[0].id
          } else {
            return { success: false, error: "No valid users found to set as author" }
          }
        }
      } catch (error) {
        console.error("Error finding fallback author:", error)
        return { success: false, error: "Failed to find a valid author for the blog post" }
      }
    }

    const post: BlogPost = {
      title,
      slug,
      excerpt,
      content,
      author_id: finalAuthorId,
      category,
      image_url,
      status: status || "draft",
    }

    await createBlogPost(post)
    revalidatePath("/admin/blog")
    return { success: true, message: "Blog post created successfully" }
  } catch (error) {
    console.error("Error creating blog post:", error)
    return { success: false, error: "Failed to create blog post" }
  }
}

export async function updateExistingBlogPost(id: number, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const excerpt = formData.get("excerpt") as string
    const content = formData.get("content") as string
    const author_id = Number.parseInt(formData.get("author_id") as string)
    const category = formData.get("category") as string
    const image_url = formData.get("image_url") as string
    const status = formData.get("status") as "draft" | "published"

    // Validate required fields
    if (!title || !slug) {
      return { success: false, error: "Title and slug are required" }
    }

    // Get the current blog post to preserve author_id if needed
    let finalAuthorId = author_id
    if (isNaN(finalAuthorId) || finalAuthorId <= 0) {
      try {
        const currentPost = await getBlogPostById(id)
        if (currentPost && currentPost.author_id) {
          finalAuthorId = currentPost.author_id
        } else {
          // Get the first admin user as a fallback
          const adminUsers = await query("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
          if (Array.isArray(adminUsers) && adminUsers.length > 0) {
            finalAuthorId = adminUsers[0].id
          } else {
            // If no admin users, get any user
            const anyUsers = await query("SELECT id FROM users LIMIT 1")
            if (Array.isArray(anyUsers) && anyUsers.length > 0) {
              finalAuthorId = anyUsers[0].id
            } else {
              return { success: false, error: "No valid users found to set as author" }
            }
          }
        }
      } catch (error) {
        console.error("Error finding fallback author:", error)
        return { success: false, error: "Failed to find a valid author for the blog post" }
      }
    }

    const post: BlogPost = {
      title,
      slug,
      excerpt,
      content,
      author_id: finalAuthorId,
      category,
      image_url,
      status: status || "draft",
    }

    await updateBlogPost(id, post)
    revalidatePath("/admin/blog")
    revalidatePath(`/blog/${slug}`)
    return { success: true, message: "Blog post updated successfully" }
  } catch (error) {
    console.error("Error updating blog post:", error)
    return { success: false, error: "Failed to update blog post" }
  }
}

export async function deleteBlogPostById(id: number) {
  try {
    await deleteBlogPost(id)
    revalidatePath("/admin/blog")
    return { success: true, message: "Blog post deleted successfully" }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, error: "Failed to delete blog post" }
  }
}

