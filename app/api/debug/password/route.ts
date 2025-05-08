import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

// This is a debug endpoint - should be removed in production
export async function POST(request: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "This endpoint is only available in development mode" }, { status: 403 })
  }

  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
    }

    await mongoose.connect(process.env.MONGODB_URI as string)
    const db = mongoose.connection.db
    const usersCollection = db.collection("users")

    // Find user by username
    const user = await usersCollection.findOne({ username })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)

    return NextResponse.json({
      isPasswordValid,
      passwordInDb: user.password.substring(0, 10) + "...", // Only show part of the hash for security
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 })
  }
}
