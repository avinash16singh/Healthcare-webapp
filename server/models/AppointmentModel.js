import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  doctorName: {
    type: String
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },
  hospitalName: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["booked", "completed", "cancelled"],
    default: "booked"
  },
  reason: {
    type: String
  }
}, { timestamps: true });


const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
