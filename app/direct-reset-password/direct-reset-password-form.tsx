"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"

export default function DirectResetPasswordForm() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationError, setValidationError] = useState("")
  const isSubmittingRef = useRef(false)

  const validatePassword = () => {
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long")
      return false
    }

    if (!/[A-Z]/.test(password)) {
      setValidationError("Password must contain at least one uppercase letter")
      return false
    }

    if (!/[a-z]/.test(password)) {
      setValidationError("Password must contain at least one lowercase letter")
      return false
    }

    if (!/[0-9]/.test(password)) {
      setValidationError("Password must contain at least one number")
      return false
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setValidationError("Password must contain at least one special character")
      return false
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent double submissions
    if (isSubmittingRef.current) {
      return
    }

    // Reset errors
    setError("")
    setValidationError("")

    // Validate code
    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      setError("Please enter a valid 6-digit code")
      return
    }

    // Validate password
    if (!validatePassword()) {
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
          code,
          password,
          action: "reset",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      // Redirect to login page with success message
      router.push("/login?reset=success")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to reset password")
    } finally {
      setIsLoading(false)
      // Reset the ref after a delay to prevent rapid successive clicks
      setTimeout(() => {
        isSubmittingRef.current = false
      }, 2000)
    }
  }

  const handleRequestNewCode = () => {
    router.push("/forgot-password")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex flex-col">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <Button type="button" className="mt-4 bg-primary hover:bg-primary/90" onClick={handleRequestNewCode}>
            Request New Code
          </Button>
        </div>
      )}

      {validationError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="code" className="text-gray-900">
          Reset Code
        </Label>
        <Input
          id="code"
          name="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter the 6-digit code from your email"
          maxLength={6}
          className="text-gray-900 text-center text-xl tracking-widest"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-900">
          New Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            disabled={isLoading}
            className="text-gray-900"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-900">
          Confirm New Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            disabled={isLoading}
            className="text-gray-900"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p className="font-medium mb-1 text-gray-900">Password Requirements:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>At least 8 characters long</li>
          <li>Contains at least one uppercase letter</li>
          <li>Contains at least one lowercase letter</li>
          <li>Contains at least one number</li>
          <li>Contains at least one special character</li>
        </ul>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>
    </form>
  )
}
