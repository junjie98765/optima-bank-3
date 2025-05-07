"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ArrowLeft, Loader2, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CartContentProps {
  userPoints: number
}

type Redemption = {
  _id: string
  code: string
  pointsSpent: number
  redemptionDate: string
  voucher: {
    _id: string
    name: string
    description: string
    points: number
    validUntil: string
    image?: string
  }
  username: string
}

export default function CartContent({ userPoints = 0 }: CartContentProps) {
  const router = useRouter()
  const { cart, loading, updateQuantity, removeItem, clearCart, totalItems, totalPoints } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [remainingPoints, setRemainingPoints] = useState(userPoints)
  const { toast } = useToast()
  const { update } = useSession()
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({})

  const canCheckout = userPoints >= totalPoints && totalItems > 0

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateQuantity(itemId, newQuantity)
  }

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId)
  }

  const handleClearCart = async () => {
    await clearCart()
  }

  const handleCheckout = async () => {
    if (!canCheckout) {
      toast({
        title: "Insufficient points",
        description: "You do not have enough points to complete this purchase.",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Checkout failed")
      }

      const data = await response.json()
      setRedemptions(data.redemptions)
      setRemainingPoints(data.remainingPoints)

      // Update the session with the new points
      await update({ points: data.remainingPoints })

      setShowSuccessDialog(true)
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An error occurred during checkout. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleDownloadPdf = async (redemptionId: string) => {
    // Set downloading state for this specific redemption
    setIsDownloading((prev) => ({ ...prev, [redemptionId]: true }))

    try {
      // Create a loading toast
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your voucher...",
      })

      // Create a link element to download the PDF
      const link = document.createElement("a")
      link.href = `/api/generate-voucher-pdf?id=${redemptionId}`
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "PDF Generated",
        description: "Your voucher PDF has been generated and should download shortly.",
      })
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast({
        title: "Download failed",
        description: "Failed to download the voucher PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      // Reset downloading state
      setIsDownloading((prev) => ({ ...prev, [redemptionId]: false }))
    }
  }

  const getImageSrc = (image?: string) => {
    if (image) {
      return image
    }
    return `/placeholder.svg?height=150&width=150`
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)

      // Check if it's a valid date
      if (isNaN(date.getTime())) {
        return dateString // Return the original string if it's not a valid date
      }

      // Format the date as "Month DD, YYYY at HH:MM AM/PM"
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch (error) {
      return dateString // Return the original string if there's an error
    }
  }

  return (
    <div className="flex-1 bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        ) : cart?.items.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
                  <div className="text-sm text-gray-500">{totalItems} item(s)</div>
                </div>

                {cart.items.map((item) => (
                  <div key={item._id} className="p-6 border-b">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-24 h-24 bg-orange-100 rounded-md flex items-center justify-center">
                        <Image
                          src={getImageSrc(item.voucher.image) || "/placeholder.svg"}
                          alt={item.voucher.name}
                          width={80}
                          height={80}
                          className="object-contain"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-primary">{item.voucher.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.voucher.description}</p>
                        <p className="text-sm text-gray-500">Valid until: {item.voucher.validUntil}</p>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="text-primary font-bold mb-2">{item.voucher.points} points</div>

                        <div className="flex items-center mb-2">
                          <button
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="mx-3">{item.quantity}</span>

                          <button
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-gray-700 font-medium mb-2">
                          {item.voucher.points * item.quantity} points
                        </div>

                        <button
                          className="text-red-500 hover:text-red-700 flex items-center text-sm"
                          onClick={() => handleRemoveItem(item._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between">
                <Button variant="outline" className="flex items-center" onClick={() => router.push("/rewards")}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
                </Button>

                <Button
                  variant="outline"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={handleClearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Clear Cart
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Items</span>
                      <span className="text-gray-900">{totalItems}</span>
                    </div>

                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-gray-900">Total Points</span>
                      <span className="text-primary">{totalPoints}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Points</span>
                      <span className="text-gray-900">{userPoints}</span>
                    </div>

                    <div className="pt-4 border-t">
                      <Button
                        className={`w-full ${
                          canCheckout ? "bg-primary hover:bg-primary/90 text-white" : "bg-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!canCheckout || isCheckingOut}
                        onClick={handleCheckout}
                      >
                        {isCheckingOut ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                          </>
                        ) : (
                          "Checkout"
                        )}
                      </Button>

                      {!canCheckout && totalItems > 0 && (
                        <p className="text-red-500 text-sm mt-2">
                          You need {totalPoints - userPoints} more points to complete this purchase.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any rewards to your cart yet.</p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white">
              <Link href="/rewards">Browse Rewards</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout Successful!</DialogTitle>
            <DialogDescription>
              Your vouchers have been redeemed successfully. You can download them below.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4 p-3 bg-green-50 rounded-md text-green-700 text-sm">
              <p>
                <strong>Points spent:</strong> {totalPoints}
              </p>
              <p>
                <strong>Remaining points:</strong> {remainingPoints}
              </p>
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {redemptions.map((redemption) => (
                <div key={redemption._id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{redemption.voucher.name}</h3>
                    <span className="text-primary font-medium">{redemption.pointsSpent} points</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{redemption.voucher.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Code: {redemption.code}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center"
                      onClick={() => handleDownloadPdf(redemption._id)}
                      disabled={isDownloading[redemption._id]}
                    >
                      {isDownloading[redemption._id] ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-1" /> Download
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Redeemed on: {formatDate(redemption.redemptionDate)}</p>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                setShowSuccessDialog(false)
                router.push("/rewards")
              }}
            >
              Continue Shopping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
