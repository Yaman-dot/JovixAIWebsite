import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import crypto from "crypto"

// This is a temporary endpoint to create an admin user
// Remove this in production!
export async function GET() {
  try {
    // Hash the password
    const password = "admin123"
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")

    console.log("Creating admin user with password hash:", hashedPassword)

    // Check if admin exists
    const existingAdmin = await query("SELECT * FROM users WHERE email = ?", ["admin@test.com"])

    if (Array.isArray(existingAdmin) && existingAdmin.length > 0) {
      return NextResponse.json({
        message: "Admin user already exists",
        user: {
          email: "admin@test.com",
          password: "admin123",
          hash: hashedPassword,
        },
      })
    }

    // Create admin user
    await query("INSERT INTO users (name, email, password, role, profile_image) VALUES (?, ?, ?, ?, ?)", [
      "Test Admin",
      "admin@test.com",
      hashedPassword,
      "admin",
      "/images/default-avatar.png",
    ])

    return NextResponse.json({
      message: "Admin user created successfully",
      user: {
        email: "admin@test.com",
        password: "admin123",
        hash: hashedPassword,
      },
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 })
  }
}

