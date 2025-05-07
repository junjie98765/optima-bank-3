import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import User from "@/lib/models/user"

export async function POST(request: NextRequest) {
  try {
    const { username, email, phone, password } = await request.json()

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ message: "Username, email, and password are required" }, { status: 400 })
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string)

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ message: "User with this email or username already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      phone: phone || "",
      password,
      points: 500, // Welcome bonus
    })

    await newUser.save()

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
