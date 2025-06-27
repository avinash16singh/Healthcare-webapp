import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: false,
  },
  diagnosis: {
    type: String,
    trim: true,
  },
  prescription: {
    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String }, // e.g., "500mg"
        frequency: { type: String }, // e.g., "Twice a day"
        duration: { type: String }, // e.g., "5 days"
      },
    ],
    notes: { type: String },
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;
