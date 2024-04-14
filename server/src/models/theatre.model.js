import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  phone_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    required: true,
  },
  room_summary: {
    type: String,
    required: true,
  },
  opening_hours: {
    type: String,
    required: true,
  },
  rooms: [
    {
      type: String,
      required: true,
    },
  ],
  is_active: {
    type: Boolean,
    default: true,
  },
  thumbnail: String,
  cover: String,
});

theatreSchema.index({ location: "2dsphere" });

export default mongoose.model("Theatre", theatreSchema);
