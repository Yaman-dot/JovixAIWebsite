"use server"

import { query } from "../db"
import crypto from "crypto"

export interface User {
  id?: number
  name: string
  email: string
  password?: string
  role?: "admin" | "editor" | "user"
  profile_image?: string
  bio?: string
  created_at?: Date
  updated_at?: Date
}

export interface UserSession {
  id?: number
  user_id: number
  session_token: string
  expires_at: Date
  created_at?: Date
}

export interface GithubUser {
  githubId: string
  name: string
  email: string
  profile_image?: string
  accessToken: string
}

// Hash password using SHA-256 (in a real app, use bcrypt or Argon2)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export async function getAllUsers() {
  try {
    return await query(
      "SELECT id, name, email, role, profile_image, bio, created_at, updated_at FROM users ORDER BY created_at DESC",
    )
  } catch (error) {
    console.error("Error getting all users:", error)
    return []
  }
}

export async function getUserById(id: number) {
  try {
    const results = await query(
      "SELECT id, name, email, role, profile_image, bio, created_at, updated_at FROM users WHERE id = ?",
      [id],
    )
    return results[0]
  } catch (error) {
    console.error(`Error getting user by ID ${id}:`, error)
    return null
  }
}

export async function getUserByEmail(email: string) {
  try {
    const results = await query(
      "SELECT id, name, email, role, profile_image, bio, created_at, updated_at FROM users WHERE email = ?",
      [email],
    )
    return results[0]
  } catch (error) {
    console.error(`Error getting user by email ${email}:`, error)
    return null
  }
}

export async function createUser(user: User) {
  try {
    const { name, email, password, role, profile_image, bio } = user

    // Hash the password before storing
    const hashedPassword = password ? hashPassword(password) : ""

    // Set default profile image if not provided
    const userProfileImage = profile_image || "/images/default-avatar.png"

    const result = await query(
      "INSERT INTO users (name, email, password, role, profile_image, bio) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role || "user", userProfileImage, bio || null],
    )

    return result
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUser(id: number, user: User) {
  try {
    const { name, email, role, profile_image, bio } = user

    // Update without changing password
    if (!user.password) {
      const result = await query(
        "UPDATE users SET name = ?, email = ?, role = ?, profile_image = ?, bio = ? WHERE id = ?",
        [name, email, role, profile_image, bio, id],
      )
      return result
    }

    // Update including password change
    const hashedPassword = hashPassword(user.password)
    const result = await query(
      "UPDATE users SET name = ?, email = ?, password = ?, role = ?, profile_image = ?, bio = ? WHERE id = ?",
      [name, email, hashedPassword, role, profile_image, bio, id],
    )

    return result
  } catch (error) {
    console.error(`Error updating user ${id}:`, error)
    throw error
  }
}

export async function deleteUser(id: number) {
  try {
    const result = await query("DELETE FROM users WHERE id = ?", [id])
    return result
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error)
    throw error
  }
}

// Authentication functions
export async function authenticateUser(email: string, password: string) {
  try {
    // Get user with password for authentication
    const results = await query("SELECT id, name, email, password, role, profile_image FROM users WHERE email = ?", [
      email,
    ])

    if (!results || !Array.isArray(results) || results.length === 0) {
      return { success: false, error: "User not found" }
    }

    const user = results[0] as any
    const hashedPassword = hashPassword(password)

    if (user.password !== hashedPassword) {
      return { success: false, error: "Invalid password" }
    }

    // Create a session
    const sessionToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Session expires in 7 days

    await query("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)", [
      user.id,
      sessionToken,
      expiresAt,
    ])

    // Return user without password and with session token
    delete user.password

    return {
      success: true,
      user,
      session: {
        token: sessionToken,
        expiresAt,
      },
    }
  } catch (error) {
    console.error("Authentication error:", error)
    throw new Error(`Authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function findOrCreateGithubUser(githubUser: GithubUser) {
  try {
    // Check if OAuth account exists
    const oauthResults = await query(
      "SELECT user_id FROM oauth_accounts WHERE provider = 'github' AND provider_user_id = ?",
      [githubUser.githubId],
    )

    let userId: number

    if (oauthResults && Array.isArray(oauthResults) && oauthResults.length > 0) {
      // User exists, update access token
      userId = (oauthResults[0] as any).user_id

      await query(
        "UPDATE oauth_accounts SET access_token = ?, updated_at = NOW() WHERE provider = 'github' AND provider_user_id = ?",
        [githubUser.accessToken, githubUser.githubId],
      )

      // Update user profile with latest GitHub data
      await query("UPDATE users SET name = ?, profile_image = ? WHERE id = ?", [
        githubUser.name,
        githubUser.profile_image,
        userId,
      ])
    } else {
      // Check if user with this email exists
      const userResults = await query("SELECT id FROM users WHERE email = ?", [githubUser.email])

      if (userResults && Array.isArray(userResults) && userResults.length > 0) {
        // User exists with this email, link GitHub account
        userId = (userResults[0] as any).id

        // Create OAuth account link
        await query(
          "INSERT INTO oauth_accounts (user_id, provider, provider_user_id, access_token, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
          [userId, "github", githubUser.githubId, githubUser.accessToken],
        )

        // Update user profile with GitHub data
        await query("UPDATE users SET profile_image = ? WHERE id = ?", [githubUser.profile_image, userId])
      } else {
        // Create new user
        const randomPassword = crypto.randomBytes(16).toString("hex")

        const newUser: User = {
          name: githubUser.name,
          email: githubUser.email,
          password: randomPassword, // Random password since login will be via GitHub
          role: "user",
          profile_image: githubUser.profile_image,
        }

        const result = await createUser(newUser)
        userId = (result as any).insertId

        // Create OAuth account link
        await query(
          "INSERT INTO oauth_accounts (user_id, provider, provider_user_id, access_token, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
          [userId, "github", githubUser.githubId, githubUser.accessToken],
        )
      }
    }

    // Get user data
    const userResults = await query("SELECT id, name, email, role, profile_image, bio FROM users WHERE id = ?", [
      userId,
    ])

    if (!userResults || !Array.isArray(userResults) || userResults.length === 0) {
      return { success: false, error: "Failed to retrieve user data" }
    }

    const user = userResults[0]

    // Create a session
    const sessionToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // Session expires in 7 days

    await query("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)", [
      userId,
      sessionToken,
      expiresAt,
    ])

    return {
      success: true,
      user,
      session: {
        token: sessionToken,
        expiresAt,
      },
    }
  } catch (error) {
    console.error("GitHub authentication error:", error)
    throw new Error(`GitHub authentication failed: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function getUserBySessionToken(token: string) {
  try {
    const results = await query(
      `SELECT u.id, u.name, u.email, u.role, u.profile_image, u.bio, u.created_at, u.updated_at 
     FROM users u
     JOIN user_sessions s ON u.id = s.user_id
     WHERE s.session_token = ? AND s.expires_at > NOW()`,
      [token],
    )

    if (!results || !Array.isArray(results) || results.length === 0) {
      return null
    }

    return results[0]
  } catch (error) {
    console.error("Session validation error:", error)
    return null
  }
}

export async function logoutUser(token: string) {
  try {
    await query("DELETE FROM user_sessions WHERE session_token = ?", [token])
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Logout failed" }
  }
}

export async function logUserActivity(userId: number | null, action: string, details: string, ipAddress?: string) {
  try {
    await query("INSERT INTO user_activity_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)", [
      userId,
      action,
      details,
      ipAddress || null,
    ])
    return { success: true }
  } catch (error) {
    console.error("Activity logging error:", error)
    return { success: false }
  }
}

export async function getUserActivity(userId: number, limit = 50) {
  try {
    const results = await query("SELECT * FROM user_activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT ?", [
      userId,
      limit,
    ])
    return { success: true, data: results }
  } catch (error) {
    console.error("Error fetching user activity:", error)
    return { success: false, error: "Failed to fetch user activity" }
  }
}

