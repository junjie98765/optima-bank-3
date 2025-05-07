"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

type CartItem = {
  _id: string
  voucher: {
    _id: string
    name: string
    description: string
    points: number
    category: string
    validUntil: string
    image?: string
  }
  quantity: number
}

type Cart = {
  _id: string
  user: string
  items: CartItem[]
  updatedAt: string
}

interface CartContextType {
  cart: Cart | null
  loading: boolean
  addToCart: (voucherId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  totalItems: number
  totalPoints: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [initialized, setInitialized] = useState(false)

  // Calculate totals
  const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
  const totalPoints = cart?.items.reduce((sum, item) => sum + item.voucher.points * item.quantity, 0) || 0

  // Fetch cart only when session is authenticated and not already initialized
  useEffect(() => {
    if (status === "authenticated" && session && !initialized) {
      fetchCart()
      setInitialized(true)
    } else if (status === "unauthenticated") {
      setCart(null)
      setLoading(false)
      setInitialized(false)
    }
  }, [status, session])

  // Fetch cart from API
  const fetchCart = async () => {
    if (loading) return

    try {
      setLoading(true)
      const response = await fetch("/api/cart")

      if (!response.ok) {
        throw new Error("Failed to fetch cart")
      }

      const data = await response.json()
      setCart(data)
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast({
        title: "Error",
        description: "Failed to load your cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Add item to cart
  const addToCart = async (voucherId: string, quantity = 1) => {
    if (!session) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ voucherId, quantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item to cart")
      }

      const data = await response.json()
      setCart(data)

      toast({
        title: "Added to cart",
        description: `${quantity} item(s) have been added to your cart.`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true)
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, quantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to update cart")
      }

      const data = await response.json()
      setCart(data)
    } catch (error) {
      console.error("Error updating cart:", error)
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Remove item from cart
  const removeItem = async (itemId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove item from cart")
      }

      const data = await response.json()
      setCart(data)

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      })
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Clear cart
  const clearCart = async () => {
    if (!cart || cart.items.length === 0) return

    try {
      setLoading(true)

      // Remove each item one by one
      for (const item of [...cart.items]) {
        await removeItem(item._id)
      }

      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPoints,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
