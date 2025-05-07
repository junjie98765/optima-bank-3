import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import mongoose from "mongoose"
import User from "@/lib/models/user"
import Voucher from "@/lib/models/voucher"
import Redemption from "@/lib/models/redemption"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { voucherId, quantity } = await request.json()

    if (!voucherId) {
      return NextResponse.json({ message: "Voucher ID is required" }, { status: 400 })
    }

    // Ensure quantity is a valid number
    const parsedQuantity = Number.parseInt(quantity, 10) || 1
    if (parsedQuantity < 1) {
      return NextResponse.json({ message: "Quantity must be at least 1" }, { status: 400 })
    }

    await mongoose.connect(process.env.MONGODB_URI as string)

    // Get voucher details
    const voucher = await Voucher.findById(voucherId)

    if (!voucher) {
      return NextResponse.json({ message: "Voucher not found" }, { status: 404 })
    }

    // Calculate total points needed
    const totalPoints = voucher.points * parsedQuantity

    // Check if user has enough points
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (user.points < totalPoints) {
      return NextResponse.json(
        {
          message: "Not enough points",
          required: totalPoints,
          available: user.points,
        },
        { status: 400 },
      )
    }

    // Create redemption record
    const redemption = new Redemption({
      user: session.user.id,
      voucher: voucherId,
      quantity: parsedQuantity,
      pointsSpent: totalPoints,
      code: uuidv4().substring(0, 8).toUpperCase(),
    })

    await redemption.save()

    // Deduct points from user
    user.points -= totalPoints
    await user.save()

    // Get the full redemption with voucher details for the response
    const fullRedemption = await Redemption.findById(redemption._id).populate("voucher")

    return NextResponse.json({
      message: "Redemption successful",
      redemption: {
        ...fullRedemption.toObject(),
        voucher: voucher.toObject(),
        username: user.username,
      },
      pointsSpent: totalPoints,
      remainingPoints: user.points,
    })
  } catch (error) {
    console.error("Error redeeming voucher:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
