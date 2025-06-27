import Appointment from "../models/AppointmentModel.js";
import Doctor from "../models/DoctorModel.js";
import MedicalRecord from "../models/MedicalRecordModel.js";

export const getDashboard = (req, res) => {};

export const getDoctorModel = async (req, res) => {
    const {id} = req.params;
  try {
    const doctor = await Doctor.findOne({ user: id }).populate('user');
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" }); // ⬅️ return is essential
    }
    res.status(200).json(doctor); // ✅ Success response
  } catch (error) {
    console.error("Error fetching Doctor Model:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server Error" }); // ⬅️ Only send if not already sent
    }
  }
};


export const getMyAppointments = async (req, res) => {
  const { userId, role } = req.query; // e.g., ?userId=xxx&role=patient/doctor

  try {
    let query = {};
    if (role === "patient") {
      query.patient = userId;
    } else if (role === "doctor") {
      query.doctor = userId;
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .populate("hospital", "name");

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
};

export const updateAppointmentStatus = (req, res) => {};

export const getEmergencyCases = (req, res) => {};
export const updateEmergencyStatus = (req, res) => {};

// Example Express.js route handler for getting a medical record by appointment ID
export const getMedicalRecordByApptId = async (req, res) => {
  const { id } = req.params;

  try {
    const medicalRecord = await MedicalRecord.findOne({ appointmentId: id });

    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found." });
    }

    return res.status(200).json(medicalRecord);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};





// Get medical records for a patient or doctor
export const getMedicalRecords = async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;

    const filter = {};
    if (patientId) filter.patient = patientId;
    if (doctorId) filter.doctor = doctorId;

    const records = await MedicalRecord.find(filter)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .populate("hospital", "name");

    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({ message: "Failed to fetch medical records." });
  }
};

// Create a new medical record
export const createMedicalRecord = async (req, res) => {
  try {
    const {
      appointmentId,
      patient,
      doctor,
      hospital,
      diagnosis,
      prescription,
      date
    } = req.body;

    const record = new MedicalRecord({
      appointmentId,
      patient,
      doctor,
      hospital,
      diagnosis,
      prescription,
      date
    });

    const savedRecord = await record.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error("Error creating medical record:", error);
    res.status(500).json({ message: "Failed to create medical record." });
  }
};

// Update an existing medical record
export const updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecord) {
      return res.status(404).json({ message: "Medical record not found." });
    }

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error("Error updating medical record:", error);
    res.status(500).json({ message: "Failed to update medical record." });
  }
};
