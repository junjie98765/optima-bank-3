import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user"
import Cart from "@/lib/models/cart"
import Redemption from "@/lib/models/redemption"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get user's cart with populated voucher details
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
        quantity: item.quantity, // Use the cart item quantity
        pointsSpent: item.voucher.points * item.quantity,
        code: uuidv4().substring(0, 8).toUpperCase(),
        status: "completed",
      })

      await redemption.save()
      redemptions.push({
        ...redemption.toObject(),
        voucher: item.voucher,
        username: user.username,
      })
    }

    // Deduct points from user
    user.points -= totalPoints
    await user.save()

    // Clear cart
    cart.items = []
    cart.updatedAt = new Date()
    await cart.save()

    return NextResponse.json({
      message: "Checkout successful",
      redemptions,
      pointsSpent: totalPoints,
      remainingPoints: user.points,
    })
  } catch (error) {
    console.error("Error during checkout:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
