import { NextResponse } from "next/server"
import { createService, getAllServices } from "@/lib/models/service"

export async function GET() {
  try {
    const services = await getAllServices()

    // Parse JSON fields
    const parsedServices = services.map((service: any) => ({
      ...service,
      features: service.features ? JSON.parse(service.features) : [],
      use_cases: service.use_cases ? JSON.parse(service.use_cases) : [],
    }))

    return NextResponse.json({
      success: true,
      services: parsedServices,
    })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const icon = formData.get("icon") as string

    // Parse JSON strings
    const featuresJson = formData.get("features") as string
    const useCasesJson = formData.get("use_cases") as string

    const features = featuresJson ? JSON.parse(featuresJson) : []
    const use_cases = useCasesJson ? JSON.parse(useCasesJson) : []

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json({ success: false, error: "Title and slug are required" }, { status: 400 })
    }

    const service = {
      title,
      slug,
      description,
      icon,
      features,
      use_cases,
    }

    const result = await createService(service)

    return NextResponse.json({
      success: true,
      message: "Service created successfully",
      serviceId: result.insertId,
    })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ success: false, error: "Failed to create service" }, { status: 500 })
  }
}

