import { type NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import Voucher from "@/lib/models/voucher"

// Seed the database with initial vouchers
export async function GET(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)

    // Check if vouchers already exist
    const existingVouchers = await Voucher.countDocuments()

    if (existingVouchers > 0) {
      return NextResponse.json({
        message: "Database already seeded",
        count: existingVouchers,
      })
    }

    // Sample vouchers data with specific images
    const vouchers = [
      {
        name: "Starbucks Gift Card",
        description: "Enjoy a cup of premium coffee at any Starbucks outlet nationwide.",
        points: 500,
        category: "Food & Dining",
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        termsAndConditions: "Valid at all participating Starbucks locations. Cannot be combined with other offers.",
        image: "/images/vouchers/starbucks.png", // Specific Starbucks image
      },
      {
        name: "Amazon $25 Gift Card",
        description: "Shop your favorite items on Amazon with this digital gift card.",
        points: 750,
        category: "Shopping",
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        termsAndConditions: "Valid for Amazon US only. Cannot be used for Amazon Prime subscription.",
        image: "/images/vouchers/amazon.png", // Specific Amazon image
      },
      {
        name: "Movie Ticket Voucher",
        description: "Get a free movie ticket at any participating cinema.",
        points: 400,
        category: "Entertainment",
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        termsAndConditions: "Valid for standard 2D screenings only. Not valid on weekends or holidays.",
        image: "/images/vouchers/movie.png", // Specific movie ticket image
      },
      {
        name: "Spotify Premium (1 Month)",
        description: "Enjoy ad-free music streaming for one month.",
        points: 300,
        category: "Entertainment",
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        termsAndConditions: "For new Spotify Premium users only. Cannot be combined with other offers.",
        image: "/images/vouchers/spotify.png", // Specific Spotify image
      },
      {
        name: "Target $20 Gift Card",
        description: "Shop for groceries, clothing, and more at any Target store.",
        points: 600,
        category: "Shopping",
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        termsAndConditions: "Valid at all Target locations in the US. Cannot be used for online purchases.",
        image: "/images/vouchers/target.png", // Specific Target image
      },
      {
        name: "Uber $15 Ride Credit",
        description: "Get $15 off your next Uber ride.",
        points: 450,
        category: "Travel",
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        termsAndConditions: "Valid for one ride up to $15. Any amount over $15 will be charged to your payment method.",
        image: "/images/vouchers/uber.png", // Specific Uber image
      },
    ]

    // Insert vouchers
    await Voucher.insertMany(vouchers)

    return NextResponse.json({
      message: "Database seeded successfully",
      count: vouchers.length,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
