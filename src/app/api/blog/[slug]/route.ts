import { NextResponse } from "next/server"
import { getBlogPostBySlug } from "@/lib/models/blog"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug
    const post = await getBlogPostBySlug(slug)

    if (!post) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }

    // Format the post for frontend consumption
    const formattedPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "No excerpt available",
      content: post.content || "",
      date: new Date(post.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      author: post.author_name || "Unknown Author",
      authorTitle: "Content Writer",
      authorBio: "A passionate writer about technology and AI advancements.",
      authorImage: "/placeholder.svg?height=100&width=100",
      category: post.category || "Uncategorized",
      image: post.image_url || "/placeholder.svg?height=600&width=1200",
      readTime: `${Math.max(3, Math.ceil((post.content?.length || 0) / 1000))} min read`,
      tags: post.category ? [post.category, "AI", "Technology"] : ["AI", "Technology"],
    }

    return NextResponse.json({ success: true, post: formattedPost })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch blog post" }, { status: 500 })
  }
}

