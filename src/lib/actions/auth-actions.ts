"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { 
  authenticateUser, 
  createUser, 
  getUserBySessionToken, 
  logoutUser, 
  logUserActivity,
  type User
} from "../models/user"

// Login action
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const rememberMe = formData.get("rememberMe") === "on"

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  try {
    const result = await authenticateUser(email, password)
    
    if (!result.success) {
      return result
    }

    // Set session cookie
    const cookieStore = cookies()
    cookieStore.set({
      name: "session_token",
      value: result.session.token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      expires: rememberMe ? result.session.expiresAt : undefined,
      maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined, // 7 days if remember me
    })

    // Log activity
    await logUserActivity(
      result.user.id, 
      "login", 
      `User logged in from ${formData.get("userAgent") || "unknown device"}`
    )

    return { success: true, user: result.user }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Register action
export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const agreeTerms = formData.get("agreeTerms") === "on"

  // Validate inputs
  if (!name || !email || !password) {
    return { success: false, error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" }
  }

  if (!agreeTerms) {
    return { success: false, error: "You must agree to the terms and conditions" }
  }

  try {
    // Create new user
    const user: User = {
      name,
      email,
      password,
      role: "user"
    }

    await createUser(user)
    
    // Auto login after registration
    const loginResult = await authenticateUser(email, password)
    
    if (!loginResult.success) {
      return { success: true, message: "Account created. Please log in." }
    }

    // Set session cookie
    const cookieStore = cookies()
    cookieStore.set({
      name: "session_token",
      value: loginResult.session.token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    })

    // Log activity
    await logUserActivity(
      loginResult.user.id, 
      "register", 
      `User registered and logged in from ${formData.get("userAgent") || "unknown device"}`
    )

    return { success: true, user: loginResult.user }
  } catch (error) {
    console.error("Registration error:", error)
    
    // Check for duplicate email error
    if (error instanceof Error && error.message.includes("Duplicate entry")) {
      return { success: false, error: "Email already exists" }
    }
    
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Logout action
export async function logoutAction() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (sessionToken) {
    // Get user before logout for activity logging
    const user = await getUserBySessionToken(sessionToken)
    
    // Delete session from database
    await logoutUser(sessionToken)
    
    // Clear cookie
    cookieStore.delete("session_token")
    
    // Log activity if user was found
    if (user) {
      await logUserActivity(user.id, "logout", "User logged out")
    }
  }

  return { success: true }
}

// Get current user
export async function getCurrentUser() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (!sessionToken) {
    return null
  }

  try {
    const user = await getUserBySessionToken(sessionToken)
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Check if user is authenticated
export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth")
  }
  
  return user
}

// Check if user is admin
export async function requireAdmin() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth")
  }
  
  if (user.role !== "admin") {
    redirect("/")
  }
  
  return user
}
