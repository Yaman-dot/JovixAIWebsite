import { NextResponse } from "next/server"
import { createPortfolioItem, getAllPortfolioItems } from "@/lib/models/portfolio"

export async function GET() {
  try {
    const items = await getAllPortfolioItems()

    // Parse JSON fields
    const parsedItems = items.map((item: any) => ({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
      results: item.results ? JSON.parse(item.results) : [],
    }))

    return NextResponse.json({
      success: true,
      items: parsedItems,
    })
  } catch (error) {
    console.error("Error fetching portfolio items:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch portfolio items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const full_description = formData.get("full_description") as string
    const client = formData.get("client") as string
    const image_url = formData.get("image_url") as string
    const category = formData.get("category") as string

    // Parse JSON strings
    const tagsJson = formData.get("tags") as string
    const resultsJson = formData.get("results") as string

    const tags = tagsJson ? JSON.parse(tagsJson) : []
    const results = resultsJson ? JSON.parse(resultsJson) : []

    // Validate required fields
    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 })
    }

    const portfolioItem = {
      title,
      description,
      full_description,
      client,
      image_url,
      tags,
      category,
      results,
    }

    const result = await createPortfolioItem(portfolioItem)

    return NextResponse.json({
      success: true,
      message: "Portfolio item created successfully",
      itemId: result.insertId,
    })
  } catch (error) {
    console.error("Error creating portfolio item:", error)
    return NextResponse.json({ success: false, error: "Failed to create portfolio item" }, { status: 500 })
  }
}

