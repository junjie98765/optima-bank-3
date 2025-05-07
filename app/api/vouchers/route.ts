import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import Voucher from "@/lib/models/voucher"

// Get all vouchers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    await mongoose.connect(process.env.MONGODB_URI as string)

    const query: any = {}

    if (category && category !== "All Categories") {
      query.category = category
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    const vouchers = await Voucher.find(query).sort({ points: 1 })

    return NextResponse.json(vouchers)
  } catch (error) {
    console.error("Error fetching vouchers:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// Create a new voucher (admin only)
export async function POST(request: NextRequest) {
  try {
    // In a real application, you would check if the user is an admin

    const voucherData = await request.json()

    // Validate required fields
    if (!voucherData.name || !voucherData.description || !voucherData.points || !voucherData.category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await mongoose.connect(process.env.MONGODB_URI as string)

    const newVoucher = new Voucher({
      name: voucherData.name,
      description: voucherData.description,
      points: voucherData.points,
      category: voucherData.category,
      validUntil: voucherData.validUntil || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      image: voucherData.image,
      termsAndConditions: voucherData.termsAndConditions,
    })

    await newVoucher.save()

    return NextResponse.json(newVoucher, { status: 201 })
  } catch (error) {
    console.error("Error creating voucher:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
