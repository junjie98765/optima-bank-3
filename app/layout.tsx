import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./css-reset.css" // Import the CSS reset first
import "./globals.css"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import AuthProvider from "@/components/auth-provider"
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Optima Rewards - Points Redeem System",
  description: "Redeem your points for exclusive rewards, discounts, and vouchers",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className="light">
      <head>
        {/* Force light mode */}
        <style>{`
          :root { color-scheme: light !important; }
          html { color-scheme: light !important; }
        `}</style>
      </head>
      <body className={inter.className}>
        <AuthProvider session={session}>
          <ThemeProviderWrapper>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </ThemeProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
