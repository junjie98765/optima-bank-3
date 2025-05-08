import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ContactForm from "./contact-form"
import { MapPin, Phone, Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us - Optima Rewards",
  description: "Get in touch with the Optima Rewards team",
}

export default function ContactUsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center text-primary mb-12">Contact Us</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-gray-200 text-white rounded-lg shadow-md p-8 h-full">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary/20 p-3 rounded-full mr-4">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p>Serkhet, NP12</p>
                      <p>Bøersdvanger 06</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/20 p-3 rounded-full mr-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p>+0099 9893 5647</p>
                      <p>+0099 3434 5678</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/20 p-3 rounded-full mr-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p>optimabank@gmail.com</p>
                      <p>info.optimabank@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <p className="text-gray-600 mb-6">
                  If you have any work or queries, send us a message here. We are happy to help!
                </p>

                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
