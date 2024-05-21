import { Schema, model } from "mongoose";

const cinemaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    movie_playing: [
      {
        movieId: {
          type: String,
          required: true,
        },
        showtime: [
          {
            date: {
              type: String,
              required: true,
            },
            times: {
              type: [String],
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default model("Cinema", cinemaSchema);
