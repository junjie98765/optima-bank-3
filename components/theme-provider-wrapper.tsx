"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { useEffect, useState } from "react"

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  // Use this to prevent hydration mismatch
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Force light mode
    document.documentElement.classList.remove("dark")
    document.documentElement.classList.add("light")
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
      {children}
    </ThemeProvider>
  )
}
