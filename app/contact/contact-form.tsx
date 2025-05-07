"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset messages
    setError("")
    setSuccess("")

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setError("All fields are required")
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      // In a real application, this would call an API to send the message
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("Your message has been sent successfully. We will get back to you soon!")
      setFormData({
        name: "",
        email: "",
        message: "",
      })
    } catch (error) {
      setError("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span className="text-gray-900">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-gray-900">
          {success}
        </div>
      )}

      <div>
        <Input
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          className="text-gray-900"
        />
      </div>

      <div>
        <Input
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className="text-gray-900"
        />
      </div>

      <div>
        <Textarea
          name="message"
          placeholder="Enter your message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          disabled={isLoading}
          className="text-gray-900"
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-gray-900" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Now"}
      </Button>
    </form>
  )
}
