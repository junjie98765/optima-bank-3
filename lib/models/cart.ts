import mongoose, { Schema, models } from "mongoose"

const CartItemSchema = new Schema({
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
})

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [CartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

const Cart = models.Cart || mongoose.model("Cart", CartSchema)

export default Cart
