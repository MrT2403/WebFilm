import { mongoose } from "mongoose";
import modelOptions from "./model.options.js";

const cinemaSchema = new mongoose.Schema(
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
  },
  modelOptions
);

export default mongoose.model("Cinema", cinemaSchema);
