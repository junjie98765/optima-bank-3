import Link from "next/link"
import type { Metadata } from "next"
import LoginForm from "./login-form"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Login - Optima Rewards",
  description: "Login to your Optima Rewards account",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div
        className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "#f9fafb" }}
      >
        <div
          className="max-w-md w-full bg-white p-8 rounded-lg shadow-md"
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        >
          <div className="text-center mb-6" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#111827" }}
            >
              Login Here
            </h1>
          </div>

          <LoginForm />

          <div className="mt-6 text-center" style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <p className="text-sm text-gray-600" style={{ fontSize: "0.875rem", color: "#4b5563" }}>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:text-primary/90 font-medium"
                style={{ color: "#ff6600", fontWeight: "500" }}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
