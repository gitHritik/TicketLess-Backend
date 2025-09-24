import { mongoose } from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    location: { type: String, required: true },
    museumName: {
      type: String,
      required: true,
    },
    locationImage: [],
    date: { type: String },
    Time: { type: String },
    People: {
      adult: { type: Number, required: true, default: 0 },
      reduced: { type: Number, required: true, default: 0 },
    },
    Price: { type: Number },
    Status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const bookingModel = mongoose.model("booking", bookingSchema);

export default bookingModel;
