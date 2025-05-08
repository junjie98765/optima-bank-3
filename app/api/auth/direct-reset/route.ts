import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"

// Add this near the top of the file, after the imports
const DEBOUNCE_PERIOD = 30000 // 30 seconds

// This endpoint handles both generating and applying reset codes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code, password, action = "generate" } = body

    // Connect directly to MongoDB
    await mongoose.connect(process.env.MONGODB_URI as string)
    const db = mongoose.connection.db
    const usersCollection = db.collection("users")

    // GENERATE RESET CODE
    if (action === "generate") {
      if (!email) {
        return NextResponse.json({ message: "Email is required" }, { status: 400 })
      }

      // Find user by email
      const user = await usersCollection.findOne({ email: email.toLowerCase() })

      if (!user) {
        // For security, still return success even if user doesn't exist
        return NextResponse.json({
          message: "If your email is registered, you will receive a password reset code shortly.",
        })
      }

      // Check if a reset code was recently generated (within the last 30 seconds)
      if (user.lastResetRequest && Date.now() - user.lastResetRequest < DEBOUNCE_PERIOD) {
        return NextResponse.json({
          message: "If your email is registered, you will receive a password reset code shortly.",
        })
      }

      // Generate a 6-digit code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
      const resetTokenExpiry = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

      // Update the user document directly
      const updateResult = await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            resetCode: resetCode,
            resetTokenExpiry: resetTokenExpiry,
            lastResetRequest: Date.now(), // Add this line
          },
        },
      )

      // Verify the update
      const updatedUser = await usersCollection.findOne({ _id: user._id })
      const updateSuccessful = updatedUser.resetCode === resetCode

      // If update failed, return error
      if (!updateSuccessful) {
        return NextResponse.json(
          {
            message: "Failed to save reset code",
          },
          { status: 500 },
        )
      }

      // Send email if configured
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        })

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Optima Rewards - Password Reset Code",
          text: `
            Hello ${user.username},
            
            You requested a password reset for your Optima Rewards account.
            
            Your password reset code is: ${resetCode}
            
            Please go to the password reset page on our website and enter this code to reset your password.
            
            This code will expire in 24 hours.
            
            If you did not request a password reset, please ignore this email.
            
            Best regards,
            The Optima Rewards Team
          `,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <h2 style="color: #ff6600;">Optima Rewards - Password Reset Code</h2>
              <p>Hello ${user.username},</p>
              <p>You requested a password reset for your Optima Rewards account.</p>
              <div style="margin: 30px 0; padding: 20px; background-color: #f8f8f8; border-radius: 5px; text-align: center;">
                <p style="margin-bottom: 10px; font-size: 14px;">Your password reset code is:</p>
                <p style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ff6600; margin: 0;">${resetCode}</p>
              </div>
              <p>Please go to the password reset page on our website and enter this code to reset your password.</p>
              <p>This code will expire in 24 hours.</p>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Best regards,<br>The Optima Rewards Team</p>
            </div>
          `,
        }

        try {
          await transporter.sendMail(mailOptions)
        } catch (emailError) {
          console.error("Error sending email:", emailError)
        }
      }

      return NextResponse.json({
        message: "If your email is registered, you will receive a password reset code shortly.",
      })
    }

    // RESET PASSWORD
    else if (action === "reset") {
      if (!code || !password) {
        return NextResponse.json({ message: "Code and password are required" }, { status: 400 })
      }

      // Find user by reset code
      const user = await usersCollection.findOne({ resetCode: code })

      if (!user) {
        return NextResponse.json({ message: "Invalid reset code" }, { status: 400 })
      }

      // Check if code is expired
      if (!user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
        return NextResponse.json({ message: "Expired reset code" }, { status: 400 })
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      // Update the user's password and clear reset fields
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: { password: hashedPassword },
          $unset: { resetCode: "", resetToken: "", resetTokenExpiry: "" },
        },
      )

      return NextResponse.json({
        message: "Password has been reset successfully",
      })
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in direct-reset:", error)
    return NextResponse.json(
      {
        message: "An error occurred",
      },
      { status: 500 },
    )
  }
}
