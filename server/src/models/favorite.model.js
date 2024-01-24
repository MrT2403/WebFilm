import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

export default mongoose.model(
  "Favorite",
  mongoose.Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      content: {
        type: String,
        required: true,
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
    },
    modelOptions
  )
);
