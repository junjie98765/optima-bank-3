import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import mongoose from "mongoose"
import Voucher from "@/lib/models/voucher"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default async function TermsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/rewards")
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string)

    // Fetch voucher details
    const voucher = await Voucher.findById(params.id)

    if (!voucher) {
      redirect("/rewards")
    }

    // Format the validUntil date
    const formattedValidUntil = new Date(voucher.validUntil).toLocaleDateString()

    // Use the formatted date in the terms
    const terms =
      voucher.termsAndConditions ||
      `
# Terms and Conditions for ${voucher.name}

## Validity
- This voucher is valid until ${formattedValidUntil}.
- The voucher cannot be used after the expiration date.

## Usage
- This voucher can only be redeemed once.
- The voucher is non-transferable and cannot be exchanged for cash.
- The voucher must be presented at the time of redemption.

## Restrictions
- This voucher cannot be combined with other promotions or discounts.
- The issuer reserves the right to modify these terms and conditions at any time.
- The voucher is subject to availability.

## Redemption Process
- To redeem this voucher, present the voucher code at the time of purchase.
- The voucher code will be provided after successful redemption.

For any questions or concerns regarding this voucher, please contact customer support.
`

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" className="mb-4 text-gray-600" asChild>
            <Link href="/rewards">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rewards
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">{voucher.name} - Terms & Conditions</CardTitle>
              <CardDescription>Please review the terms and conditions for this voucher</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="prose prose-orange max-w-none">
                <div className="text-sm text-gray-600 whitespace-pre-line p-4 bg-gray-50 rounded-md">{terms}</div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/rewards">Back to Rewards</Link>
                </Button>

                <Button className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
                  <Link href={`/rewards/${params.id}/redeem`}>Proceed to Redemption</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching voucher:", error)
    redirect("/rewards")
  }
}
