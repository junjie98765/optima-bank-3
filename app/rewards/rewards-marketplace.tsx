"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw, ShoppingCart, Plus, Minus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"

type Voucher = {
  _id: string
  name: string
  description: string
  points: number
  category: string
  validUntil: string
  image?: string
}

interface RewardsMarketplaceProps {
  vouchers: Voucher[]
  userPoints: number
}

export default function RewardsMarketplace({ vouchers = [], userPoints = 0 }: RewardsMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const { addToCart, loading: cartLoading } = useCart()
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const router = useRouter()

  const categories = ["All Categories", "Food & Dining", "Shopping", "Travel", "Entertainment", "Other"]

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch =
      voucher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || voucher.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // If no vouchers are provided, show placeholders
  const placeholderVouchers = [
    {
      _id: "1",
      name: "Starbucks Gift Card",
      description: "Enjoy a cup of premium coffee at any Starbucks outlet nationwide.",
      points: 500,
      category: "Food & Dining",
      validUntil: "Dec 31, 2023",
      image: "/images/vouchers/starbucks.png",
    },
    {
      _id: "2",
      name: "Amazon $25 Gift Card",
      description: "Shop your favorite items on Amazon with this digital gift card.",
      points: 750,
      category: "Shopping",
      validUntil: "Dec 31, 2023",
      image: "/images/vouchers/amazon.png",
    },
    {
      _id: "3",
      name: "Movie Ticket Voucher",
      description: "Get a free movie ticket at any participating cinema.",
      points: 400,
      category: "Entertainment",
      validUntil: "Nov 30, 2023",
      image: "/images/vouchers/movie.png",
    },
    {
      _id: "4",
      name: "Spotify Premium (1 Month)",
      description: "Enjoy ad-free music streaming for one month.",
      points: 300,
      category: "Entertainment",
      validUntil: "Dec 31, 2023",
      image: "/images/vouchers/spotify.png",
    },
    {
      _id: "5",
      name: "Target $20 Gift Card",
      description: "Shop for groceries, clothing, and more at any Target store.",
      points: 600,
      category: "Shopping",
      validUntil: "Dec 31, 2023",
      image: "/images/vouchers/target.png",
    },
    {
      _id: "6",
      name: "Uber $15 Ride Credit",
      description: "Get $15 off your next Uber ride.",
      points: 450,
      category: "Travel",
      validUntil: "Dec 31, 2023",
      image: "/images/vouchers/uber.png",
    },
  ]

  const displayVouchers = vouchers.length > 0 ? filteredVouchers : placeholderVouchers

  const getImageSrc = (voucher: Voucher) => {
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
      `/placeholder.svg?height=150&width=150&text=${encodeURIComponent(voucher.name)}`
    )
  }

  const handleAddToCart = async (voucherId: string) => {
    const quantity = quantities[voucherId] || 1
    await addToCart(voucherId, quantity)
    // Reset quantity after adding to cart
    setQuantities((prev) => ({ ...prev, [voucherId]: 1 }))
  }

  const incrementQuantity = (voucherId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [voucherId]: (prev[voucherId] || 1) + 1,
    }))
  }

  const decrementQuantity = (voucherId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [voucherId]: Math.max(1, (prev[voucherId] || 1) - 1),
    }))
  }

  const handleRedeemNow = (voucherId: string) => {
    router.push(`/rewards/${voucherId}/redeem`)
  }

  // Format date to a more readable format
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

  // Initialize quantity for each voucher if not already set
  displayVouchers.forEach((voucher) => {
    if (quantities[voucher._id] === undefined) {
      quantities[voucher._id] = 1
    }
  })

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Rewards Journey</h2>
        <div className="flex items-center justify-end mb-2">
          <Button variant="ghost" size="sm" className="flex items-center text-gray-500">
            <RefreshCw className="h-4 w-4 mr-1" />
            <span>Refresh</span>
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Keep earning points to unlock premium rewards and exclusive offers.
        </p>
        <Progress value={(userPoints / 1000) * 100} className="h-2 mb-2" />
        <div className="flex justify-between text-sm text-gray-600">
          <span>0 points</span>
          <span className="font-medium">{userPoints} points</span>
          <span>1,000 points</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for rewards..."
              className="pl-10 text-gray-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === category
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "hover:bg-gray-100 text-gray-900"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayVouchers.map((voucher) => (
            <div
              key={voucher._id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-4 bg-orange-100 flex items-center justify-center h-48">
                <Image
                  src={getImageSrc(voucher) || "/placeholder.svg"}
                  alt={voucher.name}
                  width={150}
                  height={150}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{voucher.name}</h3>
                  <span className="text-orange-500 font-bold">{voucher.points} points</span>
                </div>
                <p className="text-gray-600 mb-4">{voucher.description}</p>
                <p className="text-sm text-gray-500 mb-4">Valid until: {formatValidUntil(voucher.validUntil)}</p>

                <div className="flex flex-col space-y-2">
                  <Button
                    className={`w-full ${
                      userPoints >= voucher.points
                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                        : "bg-gray-300 cursor-not-allowed text-gray-700"
                    }`}
                    disabled={userPoints < voucher.points}
                    onClick={() => handleRedeemNow(voucher._id)}
                  >
                    Redeem Now
                  </Button>

                  <div className="flex items-center justify-between mt-2 mb-2">
                    <div className="flex items-center border rounded-md">
                      <button
                        type="button"
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => decrementQuantity(voucher._id)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 text-gray-900">{quantities[voucher._id] || 1}</span>
                      <button
                        type="button"
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => incrementQuantity(voucher._id)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <Button
                      variant="outline"
                      className="text-gray-900 flex items-center justify-center"
                      onClick={() => handleAddToCart(voucher._id)}
                      disabled={cartLoading}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                <div className="mt-4 text-xs text-center">
                  <Link href={`/rewards/${voucher._id}/terms`} className="text-orange-500 hover:underline">
                    View Terms & Conditions
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
