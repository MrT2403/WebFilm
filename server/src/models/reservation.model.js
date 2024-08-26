import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Pay Now", "Not Success"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

reservationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
