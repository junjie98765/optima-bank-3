import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import DirectResetForm from "./direct-reset-form"

export const metadata: Metadata = {
  title: "Forgot Password - Optima Rewards",
  description: "Reset your Optima Rewards account password",
}

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we'll send you a code to reset your password.
            </p>
          </div>

          <DirectResetForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:text-primary/90 font-medium">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
