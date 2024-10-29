import mongoose from "mongoose";

const orderModel = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  address: { type: Object, required: true },
  amount: { type: Number, required: true },

  date: { type: Number, default: Date.now() },
  payment: { type: Boolean, default: false },
});

const Order = mongoose.model("Order", orderModel);
export default Order;
