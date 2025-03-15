"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  authenticateUser,
  createUser,
  getUserBySessionToken,
  logoutUser,
  logUserActivity,
  findOrCreateGithubUser,
  type User,
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
    const cookieStore = await cookies()
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
      `User logged in from ${formData.get("userAgent") || "unknown device"}`,
    )

    return { success: true, user: result.user }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: error instanceof Error ? `Login failed: ${error.message}` : "An unexpected error occurred during login",
    }
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
      role: "user",
      profile_image: "/images/default-avatar.png", // Default profile image
    }

    await createUser(user)

    // Auto login after registration
    const loginResult = await authenticateUser(email, password)

    if (!loginResult.success) {
      return { success: true, message: "Account created. Please log in." }
    }

    // Set session cookie
    const cookieStore = await cookies()
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
      `User registered and logged in from ${formData.get("userAgent") || "unknown device"}`,
    )

    return { success: true, user: loginResult.user }
  } catch (error) {
    console.error("Registration error:", error)

    // Check for duplicate email error
    if (error instanceof Error) {
      const mysqlError = error as any
      if (mysqlError.code === "ER_DUP_ENTRY" || error.message.includes("Duplicate entry")) {
        return { success: false, error: "Email already exists" }
      }

      return {
        success: false,
        error: `Registration failed: ${error.message}`,
      }
    }

    return { success: false, error: "An unexpected error occurred during registration" }
  }
}

// GitHub authentication action
export async function githubAuthAction(code: string) {
  try {
    if (!code) {
      return { success: false, error: "Authorization code is required" }
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      return { success: false, error: `GitHub auth error: ${tokenData.error_description}` }
    }

    const accessToken = tokenData.access_token

    // Get user data from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/json",
      },
    })

    const userData = await userResponse.json()

    if (!userData.id) {
      return { success: false, error: "Failed to get user data from GitHub" }
    }

    // Get user email from GitHub
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/json",
      },
    })

    const emails = await emailsResponse.json()
    const primaryEmail = emails.find((email: any) => email.primary)?.email || emails[0]?.email

    if (!primaryEmail) {
      return { success: false, error: "No email found in GitHub account" }
    }

    // Find or create user
    const result = await findOrCreateGithubUser({
      githubId: userData.id.toString(),
      name: userData.name || userData.login,
      email: primaryEmail,
      profile_image: userData.avatar_url || "/images/default-avatar.png",
      accessToken,
    })

    if (!result.success) {
      return result
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: "session_token",
      value: result.session.token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Log activity
    await logUserActivity(result.user.id, "login", `User logged in with GitHub`)

    return { success: true, user: result.user }
  } catch (error) {
    console.error("GitHub auth error:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? `GitHub authentication failed: ${error.message}`
          : "An unexpected error occurred during GitHub authentication",
    }
  }
}

// Logout action
export async function logoutAction() {
  const cookieStore = await cookies()
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
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session_token")?.value

    if (!sessionToken) {
      return null
    }

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
