import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ResetPasswordForm from "./reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password - Optima Rewards",
  description: "Set a new password for your Optima Rewards account",
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter the 6-digit code sent to your email and your new password. If you received multiple codes, please
              use the most recent one.
            </p>
          </div>

          <ResetPasswordForm />

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
