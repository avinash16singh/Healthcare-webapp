import mongoose from "mongoose";

const emergencyCallSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AmbulanceDriver"
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  location: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    address: { type: String, default: "Unknown" }
  },
  status: {
    type: String,
    enum: [
      "pending",            // Just created
      "accepted",           // Accepted by driver
      "enRouteToPatient",   // Driver heading to patient
      "enRouteToHospital",  // Patient picked up, en route to hospital
      "arrivedAtHospital",  // Ambulance reached hospital
      "admitted",           // Patient admitted to hospital
      "discharged",         // Patient discharged from hospital
      "completed",          // Final case close
      "cancelled"           // Manually cancelled
    ],
    default: "pending"
  },
  active: {
    type: Boolean,
    default: true  // Used to mark if case is ongoing
  },
  time: {
    type: Date,
    default: Date.now
  },

  // Optional fields
  driverLocation: {
    lat: Number,
    long: Number
  },

  pickupTime: Date,
  dropTime: Date,
  cancellationReason: String,
  notes: String
}, {
  timestamps: true
});

const EmergencyCall = mongoose.model("EmergencyCall", emergencyCallSchema);
export default EmergencyCall;
