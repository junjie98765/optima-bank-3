import Link from "next/link"
import type { Metadata } from "next"
import SignupForm from "./signup-form"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Sign Up - Optima Rewards",
  description: "Create a new Optima Rewards account",
}

export default function SignupPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Sign Up Here</h1>
            <div className="mt-2 bg-orange-50 text-orange-700 p-3 rounded-md text-sm">
              Get 500 points as a welcome bonus!
            </div>
          </div>

          <SignupForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/90 font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
