import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["tv", "movie"],
      required: true,
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
);

favoriteSchema.methods.deleteDocument = async function () {
  return await this.model("Favorite").deleteOne({ _id: this._id });
};

export default mongoose.model("Favorite", favoriteSchema);
