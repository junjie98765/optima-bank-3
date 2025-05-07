import mongoose, { Schema, models } from "mongoose"

const VoucherSchema = new Schema({
  name: {
    type: String,
    required: [true, "Voucher name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  points: {
    type: Number,
    required: [true, "Points value is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Food & Dining", "Shopping", "Travel", "Entertainment", "Other"],
  },
  validUntil: {
    type: Date,
    required: [true, "Valid until date is required"],
  },
  image: {
    type: String,
    default: null, // Store the URL/path to the image
  },
  termsAndConditions: {
    type: String,
  },
})

const Voucher = models.Voucher || mongoose.model("Voucher", VoucherSchema)

export default Voucher
