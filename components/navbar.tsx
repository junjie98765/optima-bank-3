"use client"

import Link from "next/link"
import { ShoppingCart, User, LogOut, RefreshCw } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function Navbar() {
  const { data: session, update } = useSession()
  const { totalItems } = useCart()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Remove the useEffect that was causing constant refreshes

  const handleRefreshPoints = async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    try {
      // Fetch the latest user data
      const response = await fetch("/api/user/refresh-points")
      if (!response.ok) {
        throw new Error("Failed to refresh points")
      }

      const data = await response.json()

      // Update the session with the new points
      await update({ points: data.points })

      toast({
        title: "Points refreshed",
        description: `Your current points: ${data.points}`,
      })
    } catch (error) {
      console.error("Error refreshing points:", error)
      toast({
        title: "Refresh failed",
        description: "Failed to refresh points. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary">Optima</span>
          <span className="text-2xl ml-1">Rewards</span>
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-800 hover:text-primary">
            Home
          </Link>
          <Link href="/rewards" className="text-gray-800 hover:text-primary">
            Rewards
          </Link>
          <Link href="/contact-us" className="text-gray-800 hover:text-primary">
            Support
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <div className="flex items-center text-gray-700">
                <button
                  onClick={handleRefreshPoints}
                  className="mr-2 text-gray-500 hover:text-primary"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </button>
                <span className="mr-1">{session.user.points}</span>
                <span>Points</span>
              </div>
              <Link href="/cart" className="text-gray-700 hover:text-primary relative">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {totalItems}
                  </span>
                )}
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
                    <User className="h-6 w-6 text-gray-700 hover:text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4 text-secondary" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-secondary" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
