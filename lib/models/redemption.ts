import mongoose, { Schema, models } from "mongoose"

const RedemptionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  voucher: {
    type: Schema.Types.ObjectId,
    ref: "Voucher",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  pointsSpent: {
    type: Number,
    required: true,
  },
  redemptionDate: {
    type: Date,
    default: Date.now,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "completed",
  },
})

const Redemption = models.Redemption || mongoose.model("Redemption", RedemptionSchema)

export default Redemption
