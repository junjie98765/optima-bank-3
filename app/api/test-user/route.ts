import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user"

export async function GET(request: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "This endpoint is only available in development mode" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ message: "Email parameter is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({
        exists: false,
        message: "User not found",
      })
    }

    // Return user info without sensitive data
    return NextResponse.json({
      exists: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points,
        memberSince: user.memberSince,
        hasResetToken: !!user.resetToken,
        resetTokenExpiry: user.resetTokenExpiry ? new Date(user.resetTokenExpiry).toISOString() : null,
      },
    })
  } catch (error) {
    console.error("Error checking user:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Error checking user",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
