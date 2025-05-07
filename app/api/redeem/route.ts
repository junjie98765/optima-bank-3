import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import mongoose from "mongoose"
import User from "@/lib/models/user"
import Cart from "@/lib/models/cart"
import Redemption from "@/lib/models/redemption"
import { v4 as uuidv4 } from "uuid"

// Redeem vouchers from cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await mongoose.connect(process.env.MONGODB_URI as string)

    // Get user's cart
    const cart = await Cart.findOne({ user: session.user.id }).populate("items.voucher")

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 })
    }

    // Calculate total points needed
    let totalPoints = 0
    for (const item of cart.items) {
      totalPoints += item.voucher.points * item.quantity
    }

    // Check if user has enough points
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    if (user.points < totalPoints) {
      return NextResponse.json({ message: "Not enough points" }, { status: 400 })
    }

    // Create redemption records
    const redemptions = []

    for (const item of cart.items) {
      const redemption = new Redemption({
        user: session.user.id,
        voucher: item.voucher._id,
        quantity: item.quantity,
        pointsSpent: item.voucher.points * item.quantity,
        code: uuidv4().substring(0, 8).toUpperCase(),
      })

      await redemption.save()
      redemptions.push(redemption)
    }

    // Deduct points from user
    user.points -= totalPoints
    await user.save()

    // Clear cart
    cart.items = []
    cart.updatedAt = new Date()
    await cart.save()

    return NextResponse.json({
      message: "Redemption successful",
      redemptions,
      pointsSpent: totalPoints,
      remainingPoints: user.points,
    })
  } catch (error) {
    console.error("Error redeeming vouchers:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Get user's redemption history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await mongoose.connect(process.env.MONGODB_URI as string)

    const redemptions = await Redemption.find({ user: session.user.id })
      .populate("voucher")
      .sort({ redemptionDate: -1 })

    return NextResponse.json(redemptions)
  } catch (error) {
    console.error("Error fetching redemptions:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
