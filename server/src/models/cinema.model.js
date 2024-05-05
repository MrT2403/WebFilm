import { Schema, model } from "mongoose";
import modelOptions from "./model.options.js";

const moviePlayingSchema = new Schema({
  movieId: {
    type: String,
    required: true,
  },
  showtime: {
    type: [String],
    required: true,
  },
});

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
  modelOptions
);

export default model("Cinema", cinemaSchema);
