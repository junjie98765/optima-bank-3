import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import RedemptionsContent from "./redemptions-content"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectToDatabase } from "@/lib/db"
import Redemption from "@/lib/models/redemption"

export const metadata: Metadata = {
  title: "Your Redemptions - Optima Rewards",
  description: "View your redeemed vouchers",
}

async function getUserRedemptions(userId: string) {
  try {
    await connectToDatabase()

    const redemptions = await Redemption.find({ user: userId }).populate("voucher").sort({ redemptionDate: -1 }).lean()

    return JSON.parse(JSON.stringify(redemptions))
  } catch (error) {
    console.error("Failed to fetch redemptions:", error)
    return []
  }
}

export default async function RedemptionsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const redemptions = await getUserRedemptions(session.user.id)

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <RedemptionsContent redemptions={redemptions} username={session.user.name} />
      <Footer />
    </main>
  )
}
