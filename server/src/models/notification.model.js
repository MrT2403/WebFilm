import mongoose, { Schema } from "mongoose";
import modelOptions from "./model.options.js";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
    action: {
      type: String,
      enum: ["create", "delete"],
      required: true,
    },
  },
  modelOptions
);

export default mongoose.model("Notification", notificationSchema);
