import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Optima Rewards</h3>
            <p className="text-gray-600">
              Redeem your points for exclusive rewards, discounts, and vouchers from our partner brands.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="text-gray-600 hover:text-primary">
                  Rewards
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-600">
              <p>Optima Bank</p>
              <p>999 Jalan Batu</p>
              <p>Kuala Lumpur Malaysia</p>
              <p>Email: optimabank@gmail.com</p>
              <p>Phone: +6099 9893 5647</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Optima Rewards. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
