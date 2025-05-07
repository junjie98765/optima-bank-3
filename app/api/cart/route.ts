import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Cart from "@/lib/models/cart"
import Voucher from "@/lib/models/voucher"
import { connectToDatabase } from "@/lib/db"

// Get user's cart
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Find or create cart
    let cart = await Cart.findOne({ user: session.user.id }).populate({
      path: "items.voucher",
      model: Voucher,
    })

    if (!cart) {
      cart = new Cart({
        user: session.user.id,
        items: [],
      })
      await cart.save()
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { voucherId, quantity = 1 } = await request.json()
    const quantityNum = Number.parseInt(quantity.toString(), 10) || 1

    if (!voucherId) {
      return NextResponse.json({ message: "Voucher ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Verify voucher exists
    const voucher = await Voucher.findById(voucherId)

    if (!voucher) {
      return NextResponse.json({ message: "Voucher not found" }, { status: 404 })
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: session.user.id })

    if (!cart) {
      cart = new Cart({
        user: session.user.id,
        items: [],
      })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item) => item.voucher.toString() === voucherId)

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantityNum
    } else {
      // Add new item if it doesn't exist
      cart.items.push({
        voucher: voucherId,
        quantity: quantityNum,
      })
    }

    cart.updatedAt = new Date()
    await cart.save()

    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.voucher",
      model: Voucher,
    })

    return NextResponse.json(populatedCart)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { itemId, quantity } = await request.json()
    const quantityNum = Number.parseInt(quantity.toString(), 10)

    if (!itemId || quantityNum === undefined) {
      return NextResponse.json({ message: "Item ID and quantity are required" }, { status: 400 })
    }

    if (quantityNum < 0) {
      return NextResponse.json({ message: "Quantity must be at least 0" }, { status: 400 })
    }

    await connectToDatabase()

    const cart = await Cart.findOne({ user: session.user.id })

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 })
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId)

    if (itemIndex === -1) {
      return NextResponse.json({ message: "Item not found in cart" }, { status: 404 })
    }

    if (quantityNum === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1)
    } else {
      // Update quantity
      cart.items[itemIndex].quantity = quantityNum
    }

    cart.updatedAt = new Date()
    await cart.save()

    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.voucher",
      model: Voucher,
    })

    return NextResponse.json(populatedCart)
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ message: "Item ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    const cart = await Cart.findOne({ user: session.user.id })

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 })
    }

    // Remove the item from the cart
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId)

    cart.updatedAt = new Date()
    await cart.save()

    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate({
      path: "items.voucher",
      model: Voucher,
    })

    return NextResponse.json(populatedCart)
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
