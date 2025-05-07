"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

type Redemption = {
  _id: string
  code: string
  pointsSpent: number
  redemptionDate: string
  status: string
  voucher: {
    _id: string
    name: string
    description: string
    points: number
    validUntil: string
    image?: string
    category: string
  }
}

interface RedemptionsContentProps {
  redemptions: Redemption[]
  username: string
}

export default function RedemptionsContent({ redemptions = [], username = "" }: RedemptionsContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({})

  const filteredRedemptions = redemptions.filter(
    (redemption) =>
      redemption.voucher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      redemption.voucher.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      redemption.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Redemptions</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search your redemptions..."
              className="pl-10 text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredRedemptions.length > 0 ? (
            <div className="space-y-6">
              {filteredRedemptions.map((redemption) => (
                <div key={redemption._id} className="border rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 bg-orange-100 p-4 flex items-center justify-center">
                      <Image
                        src={getImageSrc(redemption.voucher.image) || "/placeholder.svg"}
                        alt={redemption.voucher.name}
                        width={120}
                        height={120}
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{redemption.voucher.name}</h2>
                          <p className="text-sm text-gray-600">{redemption.voucher.description}</p>
                        </div>
                        <div className="mt-2 md:mt-0 text-right">
                          <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                            {redemption.voucher.category}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Redemption Code</p>
                          <p className="font-mono font-medium">{redemption.code}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Redemption Date</p>
                          <p>{formatDate(redemption.redemptionDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Valid Until</p>
                          <p>{formatDate(redemption.voucher.validUntil)}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-primary font-bold">{redemption.pointsSpent} points</span>
                        </div>
                        <Button
                          variant="outline"
                          className="flex items-center"
                          onClick={() => handleDownloadPdf(redemption._id)}
                          disabled={isDownloading[redemption._id]}
                        >
                          {isDownloading[redemption._id] ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" /> Download Voucher
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No redemptions found</h3>
              <p className="text-gray-600 mb-6">
                {redemptions.length > 0
                  ? "No redemptions match your search criteria."
                  : "You haven't redeemed any vouchers yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
