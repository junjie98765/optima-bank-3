import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gift, ShoppingBag, CreditCard } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero section with dark background for contrast */}
      <div className="bg-purple-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Welcome to Our Optima Bank</h1>
            <p className="text-lg mb-8 text-white">
              Join Optima Bank's Loyalty Program and enjoy exclusive perks every time you bank with us. Earn points on
              transactions, get cashback offers, and unlock special discounts on partner brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/signup">Sign Up Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white text-purple-900 hover:bg-gray-100 border-white"
              >
                <Link href="/rewards">Explore Rewards</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-500 mb-4">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Earn Points</h3>
              <p className="text-gray-600">
                Earn points on every transaction with your Optima Bank account. The more you use, the more you earn.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-500 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Browse Rewards</h3>
              <p className="text-gray-600">
                Explore our marketplace of exclusive rewards, vouchers, and discounts from top brands.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-500 mb-4">
                <Gift className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Redeem & Enjoy</h3>
              <p className="text-gray-600">
                Redeem your points for rewards of your choice and enjoy the benefits of being an Optima member.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/rewards" className="flex items-center">
                View All Rewards <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Featured Rewards</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 bg-orange-100 flex items-center justify-center h-48">
                <Image
                  src="/images/vouchers/starbucks.png"
                  alt="Starbucks Gift Card"
                  width={150}
                  height={150}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">Starbucks Gift Card</h3>
                  <span className="text-orange-500 font-bold">500 points</span>
                </div>
                <p className="text-gray-600 mb-4">Enjoy a cup of premium coffee at any Starbucks outlet nationwide.</p>
                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <Link href="/rewards">View Details</Link>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 bg-orange-100 flex items-center justify-center h-48">
                <Image
                  src="/images/vouchers/amazon.png"
                  alt="Amazon $25 Gift Card"
                  width={150}
                  height={150}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">Amazon $25 Gift Card</h3>
                  <span className="text-orange-500 font-bold">750 points</span>
                </div>
                <p className="text-gray-600 mb-4">Shop your favorite items on Amazon with this digital gift card.</p>
                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <Link href="/rewards">View Details</Link>
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4 bg-orange-100 flex items-center justify-center h-48">
                <Image
                  src="/images/vouchers/movie.png"
                  alt="Movie Ticket Voucher"
                  width={150}
                  height={150}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">Movie Ticket Voucher</h3>
                  <span className="text-orange-500 font-bold">400 points</span>
                </div>
                <p className="text-gray-600 mb-4">Get a free movie ticket at any participating cinema.</p>
                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <Link href="/rewards">View Details</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link href="/rewards" className="flex items-center">
                View All Rewards <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
