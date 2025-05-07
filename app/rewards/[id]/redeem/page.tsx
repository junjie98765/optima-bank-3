import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import mongoose from "mongoose"
import Voucher from "@/lib/models/voucher"
import User from "@/lib/models/user"
import RedemptionConfirmation from "./redemption-confirmation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default async function RedeemPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/rewards")
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string)

    // Fetch voucher details
    const voucher = await Voucher.findById(params.id)

    if (!voucher) {
      redirect("/rewards")
    }

    // Fetch user points
    const user = await User.findById(session.user.id)

    if (!user) {
      redirect("/login")
    }

    return (
      <main className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <RedemptionConfirmation
              voucher={{
                _id: voucher._id.toString(),
                name: voucher.name,
                description: voucher.description,
                points: voucher.points,
                category: voucher.category,
                validUntil: new Date(voucher.validUntil).toLocaleDateString(),
                image: voucher.image,
                terms: voucher.termsAndConditions || "Standard terms and conditions apply to this voucher.",
              }}
              userPoints={user.points}
            />
          </div>
        </div>
        <Footer />
      </main>
    )
  } catch (error) {
    console.error("Error fetching voucher:", error)
    redirect("/rewards")
  }
}
