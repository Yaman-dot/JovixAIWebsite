"use server"

import { revalidatePath } from "next/cache"
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  type Service,
} from "../models/service"

export async function fetchAllServices() {
  try {
    const services = await getAllServices()

    // Parse JSON fields
    const parsedServices = services.map((service: any) => ({
      ...service,
      features: service.features ? JSON.parse(service.features) : [],
      use_cases: service.use_cases ? JSON.parse(service.use_cases) : [],
    }))

    return { success: true, data: parsedServices }
  } catch (error) {
    console.error("Error fetching services:", error)
    return { success: false, error: "Failed to fetch services" }
  }
}

export async function fetchServiceById(id: number) {
  try {
    const service = await getServiceById(id)
    if (!service) {
      return { success: false, error: "Service not found" }
    }

    // Parse JSON fields
    service.features = service.features ? JSON.parse(service.features) : []
    service.use_cases = service.use_cases ? JSON.parse(service.use_cases) : []

    return { success: true, data: service }
  } catch (error) {
    console.error("Error fetching service:", error)
    return { success: false, error: "Failed to fetch service" }
  }
}

export async function createNewService(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const icon = formData.get("icon") as string

    // Handle features as a JSON array
    const featuresJson = formData.get("features") as string
    const features = featuresJson ? JSON.parse(featuresJson) : []

    // Handle use cases as a JSON array
    const useCasesJson = formData.get("use_cases") as string
    const use_cases = useCasesJson ? JSON.parse(useCasesJson) : []

    // Validate required fields
    if (!title || !slug) {
      return { success: false, error: "Title and slug are required" }
    }

    const service: Service = {
      title,
      slug,
      description,
      icon,
      features,
      use_cases,
    }

    await createService(service)
    revalidatePath("/admin/services")
    revalidatePath("/services")
    return { success: true, message: "Service created successfully" }
  } catch (error) {
    console.error("Error creating service:", error)
    return { success: false, error: "Failed to create service" }
  }
}

export async function updateExistingService(id: number, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const icon = formData.get("icon") as string

    // Handle features as a JSON array
    const featuresJson = formData.get("features") as string
    const features = featuresJson ? JSON.parse(featuresJson) : []

    // Handle use cases as a JSON array
    const useCasesJson = formData.get("use_cases") as string
    const use_cases = useCasesJson ? JSON.parse(useCasesJson) : []

    // Validate required fields
    if (!title || !slug) {
      return { success: false, error: "Title and slug are required" }
    }

    const service: Service = {
      title,
      slug,
      description,
      icon,
      features,
      use_cases,
    }

    await updateService(id, service)
    revalidatePath("/admin/services")
    revalidatePath("/services")
    revalidatePath(`/services/${slug}`)
    return { success: true, message: "Service updated successfully" }
  } catch (error) {
    console.error("Error updating service:", error)
    return { success: false, error: "Failed to update service" }
  }
}

export async function deleteServiceById(id: number) {
  try {
    await deleteService(id)
    revalidatePath("/admin/services")
    revalidatePath("/services")
    return { success: true, message: "Service deleted successfully" }
  } catch (error) {
    console.error("Error deleting service:", error)
    return { success: false, error: "Failed to delete service" }
  }
}

