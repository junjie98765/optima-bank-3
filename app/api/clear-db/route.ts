import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import Voucher from "@/lib/models/voucher"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Clear the database (admin only)
export async function GET(request: NextRequest) {
  try {
    // In a production app, you would check if the user is an admin
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await mongoose.connect(process.env.MONGODB_URI as string)

    // Delete all vouchers
    await Voucher.deleteMany({})

    return NextResponse.json({
      message: "Database cleared successfully",
    })
  } catch (error) {
    console.error("Error clearing database:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
