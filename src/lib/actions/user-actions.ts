"use server"

import { revalidatePath } from "next/cache"
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, type User } from "../models/user"

export async function fetchAllUsers() {
  try {
    const users = await getAllUsers()
    return { success: true, data: users }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}

export async function fetchUserById(id: number) {
  try {
    const user = await getUserById(id)
    if (!user) {
      return { success: false, error: "User not found" }
    }
    return { success: true, data: user }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { success: false, error: "Failed to fetch user" }
  }
}

export async function createNewUser(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as "admin" | "editor" | "user"

    // Validate required fields
    if (!name || !email || !password) {
      return { success: false, error: "Name, email, and password are required" }
    }

    // In a real app, you would hash the password before storing it
    const user: User = {
      name,
      email,
      password,
      role: role || "user",
    }

    await createUser(user)
    revalidatePath("/admin/users")
    return { success: true, message: "User created successfully" }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateExistingUser(id: number, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as "admin" | "editor" | "user"

    // Validate required fields
    if (!name || !email) {
      return { success: false, error: "Name and email are required" }
    }

    const user: User = {
      name,
      email,
      password: password || undefined,
      role: role || "user",
    }

    await updateUser(id, user)
    revalidatePath("/admin/users")
    return { success: true, message: "User updated successfully" }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUserById(id: number) {
  try {
    await deleteUser(id)
    revalidatePath("/admin/users")
    return { success: true, message: "User deleted successfully" }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

