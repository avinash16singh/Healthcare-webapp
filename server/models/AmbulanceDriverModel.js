import mongoose from "mongoose";

const ambulanceDriverSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  ambulanceNumber: { type: String, required: true },
  ambulanceType: { type: String },
  licenseNumber: { type: String, required: true },
  onDuty: { type: Boolean, default: true },
}, { timestamps: true });


const AmbulanceDriver = mongoose.model("AmbulanceDriver", ambulanceDriverSchema);
export default AmbulanceDriver;