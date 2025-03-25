import { NextResponse } from "next/server"
import { getAllBlogPosts } from "@/lib/models/blog"

export async function GET() {
  try {
    const posts = await getAllBlogPosts()

    // Transform the posts to match the expected format in the frontend
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || "No excerpt available",
      content: post.content,
      date: new Date(post.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      author: post.author_name || "Unknown Author",
      category: post.category || "Uncategorized",
      image: post.image_url || "/placeholder.svg?height=200&width=400",
      slug: post.slug,
      readTime: `${Math.max(3, Math.ceil((post.content?.length || 0) / 1000))} min read`,
    }))

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

