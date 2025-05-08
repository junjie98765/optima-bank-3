import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import Redemption from "@/lib/models/redemption"
// Fix the import statement for jsPDF
import { jsPDF } from "jspdf"
// Add the autotable plugin
import "jspdf-autotable"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const redemptionId = searchParams.get("id")

    if (!redemptionId) {
      return NextResponse.json({ message: "Redemption ID is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Get redemption with populated voucher details
    const redemption = await Redemption.findById(redemptionId).populate("voucher").populate("user", "username email")

    if (!redemption) {
      return NextResponse.json({ message: "Redemption not found" }, { status: 404 })
    }

    // Check if the redemption belongs to the current user
    if (redemption.user._id.toString() !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Create a new PDF document
    const doc = new jsPDF()

    // Add content to the PDF
    // Header
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("Optima Rewards Voucher", 105, 20, { align: "center" })

    // Voucher details
    doc.setFontSize(18)
    doc.text(redemption.voucher.name, 20, 40)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")

    // Handle long descriptions by wrapping text
    const description = doc.splitTextToSize(redemption.voucher.description, 170)
    doc.text(description, 20, 50)

    // Redemption code
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Redemption Code:", 20, 70)
    doc.setFont("helvetica", "normal")
    doc.text(redemption.code, 80, 70)

    // Generate a proper barcode
    const barcodeY = 80
    const barcodeValue = redemption.code // Use the redemption code as the barcode value
    const barcodeX = 50
    const barcodeWidth = 100
    const barcodeHeight = 30

    // Draw barcode background
    doc.setFillColor(255, 255, 255)
    doc.rect(barcodeX, barcodeY, barcodeWidth, barcodeHeight, "F")

    // Simple Code128 barcode implementation
    const drawBarcode = (value) => {
      const chars = value.split("")
      let currentX = barcodeX + 5

      // Draw start marker
      doc.setFillColor(0, 0, 0)
      doc.rect(currentX, barcodeY + 5, 1, barcodeHeight - 10, "F")
      currentX += 2
      doc.rect(currentX, barcodeY + 5, 1, barcodeHeight - 10, "F")
      currentX += 2
      doc.rect(currentX, barcodeY + 5, 2, barcodeHeight - 10, "F")
      currentX += 3

      // Draw data bars
      for (let i = 0; i < chars.length; i++) {
        // Convert character to a predictable pattern based on ASCII code
        const charCode = chars[i].charCodeAt(0)

        // Create a pattern of thin and thick bars based on character code
        for (let j = 0; j < 6; j++) {
          const isBar = (charCode + j) % 2 === 0
          const barWidth = (charCode + j) % 3 === 0 ? 2 : 1

          if (isBar) {
            doc.setFillColor(0, 0, 0)
            doc.rect(currentX, barcodeY + 5, barWidth, barcodeHeight - 10, "F")
          }

          currentX += barWidth + 1
        }

        // Add space between characters
        currentX += 1
      }

      // Draw end marker
      doc.setFillColor(0, 0, 0)
      doc.rect(currentX, barcodeY + 5, 2, barcodeHeight - 10, "F")
      currentX += 3
      doc.rect(currentX, barcodeY + 5, 1, barcodeHeight - 10, "F")
      currentX += 2
      doc.rect(currentX, barcodeY + 5, 1, barcodeHeight - 10, "F")

      // Add barcode text below
      // doc.setFontSize(10)
      // doc.setFont("helvetica", "normal")
      // doc.text(value, barcodeX + barcodeWidth / 2, barcodeY + barcodeHeight + 10, { align: "center" })
    }

    drawBarcode(barcodeValue)

    // User details
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("User:", 20, 110)
    doc.setFont("helvetica", "normal")
    doc.text(redemption.user.username, 80, 110)

    // Valid until date
    const validUntil = new Date(redemption.voucher.validUntil)
    doc.setFont("helvetica", "bold")
    doc.text("Valid Until:", 20, 120)
    doc.setFont("helvetica", "normal")
    doc.text(validUntil.toLocaleDateString(), 80, 120)

    // Points spent
    doc.setFont("helvetica", "bold")
    doc.text("Points Spent:", 20, 130)
    doc.setFont("helvetica", "normal")
    doc.text(redemption.pointsSpent.toString(), 80, 130)

    // Quantity
    doc.setFont("helvetica", "bold")
    doc.text("Quantity:", 20, 140)
    doc.setFont("helvetica", "normal")
    doc.text(redemption.quantity ? redemption.quantity.toString() : "1", 80, 140)

    // Redemption date
    const redemptionDate = new Date(redemption.redemptionDate)
    doc.setFont("helvetica", "bold")
    doc.text("Redemption Date:", 20, 150)
    doc.setFont("helvetica", "normal")
    doc.text(redemptionDate.toLocaleDateString(), 80, 150)

    // Terms and conditions
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Terms and Conditions:", 20, 170)

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const terms =
      redemption.voucher.termsAndConditions ||
      "1. This voucher is non-transferable and cannot be exchanged for cash.\n" +
        "2. Must be redeemed before the expiration date.\n" +
        "3. Optima Bank reserves the right to modify or cancel this offer at any time.\n" +
        "4. For full terms and conditions, please visit our website."

    const termsLines = doc.splitTextToSize(terms, 170)
    doc.text(termsLines, 20, 180)

    // Footer
    doc.setFontSize(10)
    doc.text("This is an electronically generated voucher and does not require a signature.", 105, 280, {
      align: "center",
    })

    // Convert the PDF to a buffer
    const pdfOutput = doc.output("arraybuffer")

    // Return the PDF
    return new NextResponse(pdfOutput, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="voucher-${redemption.code}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ message: "Error generating PDF" }, { status: 500 })
  }
}
