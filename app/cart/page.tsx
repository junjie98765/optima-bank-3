import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import CartContent from "./cart-content"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Your Cart - Optima Rewards",
  description: "View and manage your cart items",
}

export default async function CartPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <CartContent userPoints={session.user.points} />
      <Footer />
    </main>
  )
}
