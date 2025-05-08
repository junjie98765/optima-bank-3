import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About Us - Optima Rewards",
  description: "Learn more about Optima Rewards and our mission",
}

export default function AboutPage() {
  // Team member data
  const teamMembers = [
    {
      id: 1,
      name: "Ong",
      position: "Chief Executive Officer",
      image: "/images/team/ong.jpg",
    },
    {
      id: 2,
      name: "Sakthy",
      position: "Chief Financial Officer",
      image: "/images/team/sakthy.jpg",
    },
    {
      id: 3,
      name: "Thushaanya",
      position: "Chief Technology Officer",
      image: "/images/team/thusha.jpg",
    },
    {
      id: 4,
      name: "Shazbilah",
      position: "Chief Marketing Officer",
      image: "/images/team/shaz.jpg",
    },
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center text-primary mb-12">About Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Welcome To Our Website</h2>
              <p className="text-gray-700 mb-6">
                At OptimaBank, we are committed to providing comprehensive and innovative banking solutions that cater
                to the diverse needs of our customers. Established with the vision of financial inclusivity, we bring
                together local expertise and global standards to deliver personalized services.
              </p>
              <p className="text-gray-700 mb-6">
                Our rewards program is designed to give back to our loyal customers. Every time you use our services,
                you earn points that can be redeemed for exclusive rewards from our partner brands.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/about/about-optima-bank.jpg"
                alt="About Optima Bank"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Mission & Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg bg-gray-50">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Trust</h3>
                <p className="text-gray-600">
                  We build lasting relationships with our customers based on transparency and reliability.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-gray-50">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We continuously evolve our services to meet the changing needs of our customers.
                </p>
              </div>

              <div className="text-center p-6 rounded-lg bg-gray-50">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">
                  We are committed to making a positive impact in the communities we serve.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-gray-600 text-sm">{member.position}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
