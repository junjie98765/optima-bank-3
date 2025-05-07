import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import RewardsMarketplace from "./rewards-marketplace"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user"

export const metadata: Metadata = {
  title: "Rewards Marketplace - Optima Rewards",
  description: "Browse and redeem your points for exclusive rewards",
}

async function getVouchers() {
  try {
    const { db } = await connectToDatabase()
    const vouchers = await db.collection("vouchers").find({}).toArray()
    return JSON.parse(JSON.stringify(vouchers))
  } catch (error) {
    console.error("Failed to fetch vouchers:", error)
    return []
  }
}

async function getUserPoints(userId: string) {
  try {
    await connectToDatabase()
    const user = await User.findById(userId)
    return user ? user.points : 0
  } catch (error) {
    console.error("Failed to fetch user points:", error)
    return 0
  }
}

export default async function RewardsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const vouchers = await getVouchers()

  // Get the latest user points from the database
  const latestPoints = await getUserPoints(session.user.id)

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-orange-300 p-8 rounded-lg mb-8">
            <h1 className="text-3xl font-bold mb-4 text-white">Rewards Marketplace</h1>
            <p className="text-lg text-white">
              Redeem your points for exclusive rewards, discounts, and vouchers from our partner brands.
            </p>
          </div>

          <RewardsMarketplace vouchers={vouchers} userPoints={latestPoints || session.user.points} />
        </div>
      </div>

      <Footer />
    </main>
  )
}
