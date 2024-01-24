import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Review",
  mongoose.Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      mediaType: {
        type: String,
        required: true,
        enum: ["tv", "movie"],
      },
      mediaId: {
        type: String,
        required: true,
      },
      mediaTitle: {
        type: String,
        required: true,
      },
      mediaPoster: {
        type: String,
        required: true,
      },
      mediaRate: {
        type: Number,
        required: true,
      },
    },
    modelOptions
  )
);
