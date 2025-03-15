"use server"

import { query } from "../db"

export interface User {
  id?: number
  name: string
  email: string
  password?: string
  role?: "admin" | "editor" | "user"
  created_at?: Date
  updated_at?: Date
}

export async function getAllUsers() {
  return await query("SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC")
}

export async function getUserById(id: number) {
  const results = await query("SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?", [id])
  return results[0]
}

export async function getUserByEmail(email: string) {
  const results = await query("SELECT id, name, email, role, created_at, updated_at FROM users WHERE email = ?", [
    email,
  ])
  return results[0]
}

export async function createUser(user: User) {
  const { name, email, password, role } = user

  // In a real app, you would hash the password before storing it
  const result = await query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
    name,
    email,
    password,
    role || "user",
  ])

  return result
}

export async function updateUser(id: number, user: User) {
  const { name, email, role } = user

  // Update without changing password
  if (!user.password) {
    const result = await query("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?", [name, email, role, id])
    return result
  }

  // Update including password change
  // In a real app, you would hash the password before storing it
  const result = await query("UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?", [
    name,
    email,
    user.password,
    role,
    id,
  ])

  return result
}

export async function deleteUser(id: number) {
  const result = await query("DELETE FROM users WHERE id = ?", [id])
  return result
}

