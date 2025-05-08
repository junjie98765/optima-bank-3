"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DirectResetForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const isSubmittingRef = useRef(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent double submissions
    if (isSubmittingRef.current) {
      return
    }

    // Reset states
    setError("")
    setSuccess(false)

    // Validate email
    if (!email) {
      setError("Email is required")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    isSubmittingRef.current = true // Set the ref to true

    try {
      const response = await fetch("/api/auth/direct-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          action: "generate",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `Server responded with status ${response.status}`)
      }

      setSuccess(true)
    } catch (error) {
      console.error("Password reset error:", error)
      setError(error instanceof Error ? error.message : "Failed to send reset code. Please try again later.")
    } finally {
      setIsLoading(false)
      // Reset the ref after a delay to prevent rapid successive clicks
      setTimeout(() => {
        isSubmittingRef.current = false
      }, 2000)
    }
  }

  const handleGoToResetPage = () => {
    router.push("/reset-password")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Error sending reset code</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex flex-col">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              Password reset code has been sent to your email. Please check your inbox and follow the instructions.
            </span>
          </div>
          <Button onClick={handleGoToResetPage} className="mt-4 bg-primary hover:bg-primary/90">
            Go to Reset Password Page
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-900">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          disabled={isLoading || success}
          className="text-gray-900"
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading || success}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          "Send Reset Code"
        )}
      </Button>
    </form>
  )
}
