import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
  {
    cinemaId: {
      type: String,
      required: true,
    },
    showtime: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    seats: [
      {
        number: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["available", "booked"],
          default: "available",
          required: true,
        },
      },
    ],
  },
  {
    indexes: [
      {
        fields: { cinemaId: 1, showtime: 1, date: 1, "seats.number": 1 },
        options: { unique: true },
      },
    ],
  }
);

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;
