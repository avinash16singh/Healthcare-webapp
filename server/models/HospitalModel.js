import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      trim: true, 
    },
    type: {
      type: String,
      enum: ["government", "private"],
      required: true,
    },

    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      website: { type: String },
    },

    location: {
      area: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      pinCode: { type: String },
      coordinates: {
        lat: { type: Number },
        long: { type: Number },
      },
    },

    totalBeds: {
      type: Number,
      required: true,
    },
    emergencyBeds: {
      type: Number,
      required: true,
    },
    hospitalAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;
