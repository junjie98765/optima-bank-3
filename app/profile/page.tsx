import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProfileContent from "./profile-content"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectToDatabase } from "@/lib/db"

export const metadata: Metadata = {
  title: "Your Profile - Optima Rewards",
  description: "View and manage your profile information",
}

async function getUserProfile(userId: string) {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ _id: userId })

    if (!user) {
      return null
    }

    // Don't send the password to the client
    const { password, ...userWithoutPassword } = user

    return JSON.parse(JSON.stringify(userWithoutPassword))
  } catch (error) {
    console.error("Failed to fetch user profile:", error)
    return null
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const userProfile = await getUserProfile(session.user.id)

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <ProfileContent
        userProfile={
          userProfile || {
            username: session.user.name,
            email: session.user.email,
            points: userProfile?.points || session.user.points, // Prefer database points
            memberSince: new Date().toISOString(),
          }
        }
      />

      <Footer />
    </main>
  )
}
