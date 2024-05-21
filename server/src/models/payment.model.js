import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  methods: { type: String, required: true },
  reservation_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
