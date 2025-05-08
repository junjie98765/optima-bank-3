import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function GET() {
  // Only allow in development mode
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ message: "This endpoint is only available in development mode" }, { status: 403 })
  }

  try {
    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          message: "Email configuration is missing",
          requiredEnvVars: ["EMAIL_USER", "EMAIL_PASSWORD", "EMAIL_SERVICE"],
        },
        { status: 500 },
      )
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Verify the connection
    await transporter.verify()

    return NextResponse.json({
      success: true,
      message: "Email configuration is valid",
      emailUser: process.env.EMAIL_USER,
      emailService: process.env.EMAIL_SERVICE || "gmail",
    })
  } catch (error) {
    console.error("Email test failed:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Email configuration test failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
