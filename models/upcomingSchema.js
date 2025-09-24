import { mongoose } from "mongoose";

const upcomingSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    location: { type: String, required: true },
    museumName: {
      type: String,
      required: true,
    },
    locationImage: [],
    Date: { type: Number },
    Time: { type: Number },
    People: { type: String },
  },
  {
    timestamps: true,
  }
);

const unleaseModel = mongoose.model("upcoming", upcomingSchema);

export default unleaseModel;
