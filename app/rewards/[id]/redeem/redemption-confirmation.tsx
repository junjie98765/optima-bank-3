"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, ArrowLeft, AlertCircle, Loader2, Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSession } from "next-auth/react"

type VoucherWithTerms = {
  _id: string
  name: string
  description: string
  points: number
  category: string
  validUntil: string
  image?: string
  terms: string
}

interface RedemptionConfirmationProps {
  voucher: VoucherWithTerms
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

export default function RedemptionConfirmation({ voucher, userPoints }: RedemptionConfirmationProps) {
  const [quantity, setQuantity] = useState(1)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [redemption, setRedemption] = useState<Redemption | null>(null)
  const [remainingPoints, setRemainingPoints] = useState(userPoints)
  const router = useRouter()
  const { toast } = useToast()
  const { update } = useSession()

  const totalPoints = voucher.points * quantity
  const canAfford = userPoints >= totalPoints

  const incrementQuantity = () => {
    // Calculate max affordable quantity
    const maxAffordable = Math.floor(userPoints / voucher.points)
    if (quantity < maxAffordable) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleRedeem = async () => {
    if (!canAfford) return

    try {
      setIsRedeeming(true)

      const response = await fetch("/api/redeem/direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voucherId: voucher._id,
          quantity,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to redeem voucher")
      }

      const data = await response.json()

      // Update the session with the new points
      await update({ points: data.remainingPoints })

      setRedemption(data.redemption)
      setRemainingPoints(data.remainingPoints)
      setShowSuccessDialog(true)

      toast({
        title: "Redemption Successful",
        description: `You have successfully redeemed ${quantity} ${voucher.name} voucher(s).`,
      })
    } catch (error) {
      console.error("Error redeeming voucher:", error)
      toast({
        title: "Redemption Failed",
        description: error instanceof Error ? error.message : "Failed to redeem voucher. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRedeeming(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!redemption) return

    setIsDownloading(true)

    try {
      // Create a loading toast
      toast({
        title: "Generating PDF",
        description: "Please wait while we generate your voucher...",
      })

      // Create a link element to download the PDF
      const link = document.createElement("a")
      link.href = `/api/generate-voucher-pdf?id=${redemption._id}`
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
      setIsDownloading(false)
    }
  }

  const getImageSrc = () => {
    if (voucher.image) {
      return voucher.image
    }

    // Category-based fallback images
    const categoryImages: Record<string, string> = {
      "Food & Dining": "/images/categories/food.png",
      Shopping: "/images/categories/shopping.png",
      Travel: "/images/categories/travel.png",
      Entertainment: "/images/categories/entertainment.png",
      Other: "/images/categories/other.png",
    }

    return (
      categoryImages[voucher.category] ||
      `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(voucher.name)}`
    )
  }

  const formatValidUntil = (dateString: string) => {
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
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" className="mb-4 text-gray-600" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Rewards
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Confirm Redemption</CardTitle>
          <CardDescription>Review your voucher details before confirming your redemption</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 bg-orange-100 rounded-lg p-4 flex items-center justify-center">
              <Image
                src={getImageSrc() || "/placeholder.svg"}
                alt={voucher.name}
                width={200}
                height={200}
                className="object-contain"
                unoptimized
              />
            </div>

            <div className="md:w-2/3">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{voucher.name}</h3>
              <p className="text-gray-600 mb-4">{voucher.description}</p>

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Valid until: {formatValidUntil(voucher.validUntil)}</span>
                <span className="text-orange-500 font-bold">{voucher.points} points each</span>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-4">Quantity:</span>
                  <div className="flex items-center border rounded-md">
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-gray-900">{quantity}</span>
                    <button
                      type="button"
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50"
                      onClick={incrementQuantity}
                      disabled={!canAfford || userPoints < voucher.points * (quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-600">Total Cost:</div>
                  <div className="text-xl font-bold text-orange-500">{totalPoints} points</div>
                </div>
              </div>

              {!canAfford && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Insufficient Points</AlertTitle>
                  <AlertDescription>
                    You don't have enough points for this redemption. You need {totalPoints - userPoints} more points.
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-sm text-gray-600 mb-2">
                Your current balance: <span className="font-medium">{userPoints} points</span>
              </div>
              <div className="text-sm text-gray-600">
                Remaining after redemption:{" "}
                <span className="font-medium">{Math.max(0, userPoints - totalPoints)} points</span>
              </div>
            </div>
          </div>

          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="terms">
              <AccordionTrigger className="text-gray-900">Terms & Conditions</AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-gray-600 whitespace-pre-line p-4 bg-gray-50 rounded-md">
                  {voucher.terms}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleRedeem}
            disabled={!canAfford || isRedeeming}
            className={`w-full sm:w-auto ${
              canAfford ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {isRedeeming ? "Processing..." : "Confirm Redemption"}
          </Button>
        </CardFooter>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Redemption Successful!</DialogTitle>
            <DialogDescription>
              Your voucher has been redeemed successfully. You can download it below.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4 p-3 bg-green-50 rounded-md text-green-700 text-sm">
              <p>
                <strong>Points spent:</strong> {redemption?.pointsSpent || totalPoints}
              </p>
              <p>
                <strong>Remaining points:</strong> {remainingPoints}
              </p>
            </div>

            {redemption && (
              <div className="border rounded-md p-4">
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
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
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
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setShowSuccessDialog(false)
                router.push("/redemptions")
              }}
            >
              View All Vouchers
            </Button>
            <Button
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
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
