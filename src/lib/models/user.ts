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

// Hash password using SHA-256 (in a real app, use bcrypt or Argon2)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function getAllUsers() {
return await query("SELECT id, name, email, role, profile_image, bio, created_at, updated_at FROM users ORDER BY created_at DESC")
}

export async function getUserById(id: number) {
const results = await query("SELECT id, name, email, role, profile_image, bio, created_at, updated_at FROM users WHERE id = ?", [id])
return results[0]
}

export async function getUserByEmail(email: string) {
const results = await query("SELECT id, name, email, role, profile_image, bio, created_at, updated_at FROM users WHERE email = ?", [
  email,
])
return results[0]
}

export async function createUser(user: User) {
const { name, email, password, role, profile_image, bio } = user

// Hash the password before storing
const hashedPassword = password ? hashPassword(password) : '';

const result = await query(
  "INSERT INTO users (name, email, password, role, profile_image, bio) VALUES (?, ?, ?, ?, ?, ?)", 
  [name, email, hashedPassword, role || "user", profile_image || null, bio || null]
);

return result
}

export async function updateUser(id: number, user: User) {
const { name, email, role, profile_image, bio } = user

// Update without changing password
if (!user.password) {
  const result = await query(
    "UPDATE users SET name = ?, email = ?, role = ?, profile_image = ?, bio = ? WHERE id = ?", 
    [name, email, role, profile_image, bio, id]
  );
  return result
}

// Update including password change
const hashedPassword = hashPassword(user.password);
const result = await query(
  "UPDATE users SET name = ?, email = ?, password = ?, role = ?, profile_image = ?, bio = ? WHERE id = ?", 
  [name, email, hashedPassword, role, profile_image, bio, id]
);

return result
}

export async function deleteUser(id: number) {
const result = await query("DELETE FROM users WHERE id = ?", [id])
return result
}

// Authentication functions
export async function authenticateUser(email: string, password: string) {
try {
  // Get user with password for authentication
  const results = await query("SELECT id, name, email, password, role FROM users WHERE email = ?", [email]);
  
  if (!results || !Array.isArray(results) || results.length === 0) {
    return { success: false, error: "User not found" };
  }
  
  const user = results[0] as any;
  const hashedPassword = hashPassword(password);
  
  if (user.password !== hashedPassword) {
    return { success: false, error: "Invalid password" };
  }
  
  // Create a session
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days
  
  await query(
    "INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)",
    [user.id, sessionToken, expiresAt]
  );
  
  // Return user without password and with session token
  delete user.password;
  
  return { 
    success: true, 
    user, 
    session: { 
      token: sessionToken, 
      expiresAt 
    } 
  };
} catch (error) {
  console.error("Authentication error:", error);
  return { success: false, error: "Authentication failed" };
}
}

export async function getUserBySessionToken(token: string) {
try {
  const results = await query(
    `SELECT u.id, u.name, u.email, u.role, u.profile_image, u.bio, u.created_at, u.updated_at 
     FROM users u
     JOIN user_sessions s ON u.id = s.user_id
     WHERE s.session_token = ? AND s.expires_at > NOW()`,
    [token]
  );
  
  if (!results || !Array.isArray(results) || results.length === 0) {
    return null;
  }
  
  return results[0];
} catch (error) {
  console.error("Session validation error:", error);
  return null;
}
}

export async function logoutUser(token: string) {
try {
  await query("DELETE FROM user_sessions WHERE session_token = ?", [token]);
  return { success: true };
} catch (error) {
  console.error("Logout error:", error);
  return { success: false, error: "Logout failed" };
}
}

export async function logUserActivity(userId: number | null, action: string, details: string, ipAddress?: string) {
try {
  await query(
    "INSERT INTO user_activity_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)",
    [userId, action, details, ipAddress || null]
  );
  return { success: true };
} catch (error) {
  console.error("Activity logging error:", error);
  return { success: false };
}
}

export async function getUserActivity(userId: number, limit: number = 50) {
try {
  const results = await query(
    "SELECT * FROM user_activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
    [userId, limit]
  );
  return { success: true, data: results };
} catch (error) {
  console.error("Error fetching user activity:", error);
  return { success: false, error: "Failed to fetch user activity" };
}
}
