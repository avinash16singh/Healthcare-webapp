import mongoose from "mongoose";


const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital", required: true },
  specialties: [{ type: String }],
  department: { type: String },
  licenseNumber: { type: String },
  availability: [{ day: String, timeSlots: [String] }],
  doctorType: {
    type: String,
    enum: ["general", "emergency"],
    required: true,
    default: "general",
  },
}, { timestamps: true });


const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;