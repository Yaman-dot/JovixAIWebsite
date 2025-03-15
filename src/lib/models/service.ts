"use server"

import { query } from "../db"

export interface Service {
  id?: number
  title: string
  slug: string
  description?: string
  icon?: string
  features?: any
  use_cases?: any
  created_at?: Date
  updated_at?: Date
}

export async function getAllServices() {
  return await query("SELECT * FROM services ORDER BY created_at DESC")
}

export async function getServiceById(id: number) {
  const results = await query("SELECT * FROM services WHERE id = ?", [id])
  return results[0]
}

export async function getServiceBySlug(slug: string) {
  const results = await query("SELECT * FROM services WHERE slug = ?", [slug])
  return results[0]
}

export async function createService(service: Service) {
  const { title, slug, description, icon, features, use_cases } = service

  // Convert JSON objects to strings for storage
  const featuresJson = features ? JSON.stringify(features) : null
  const useCasesJson = use_cases ? JSON.stringify(use_cases) : null

  const result = await query(
    "INSERT INTO services (title, slug, description, icon, features, use_cases) VALUES (?, ?, ?, ?, ?, ?)",
    [title, slug, description, icon, featuresJson, useCasesJson],
  )

  return result
}

export async function updateService(id: number, service: Service) {
  const { title, slug, description, icon, features, use_cases } = service

  // Convert JSON objects to strings for storage
  const featuresJson = features ? JSON.stringify(features) : null
  const useCasesJson = use_cases ? JSON.stringify(use_cases) : null

  const result = await query(
    "UPDATE services SET title = ?, slug = ?, description = ?, icon = ?, features = ?, use_cases = ? WHERE id = ?",
    [title, slug, description, icon, featuresJson, useCasesJson, id],
  )

  return result
}

export async function deleteService(id: number) {
  const result = await query("DELETE FROM services WHERE id = ?", [id])
  return result
}

