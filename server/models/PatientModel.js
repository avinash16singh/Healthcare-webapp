import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicalHistory: [{ type: String }],
  allergies: [{ type: String }],
  bloodType: { type: String },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },
}, { timestamps: true });


const Patient = mongoose.model("Patient", patientSchema);
export default Patient;