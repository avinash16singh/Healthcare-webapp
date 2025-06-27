import Appointment from "../models/AppointmentModel.js";
import EmergencyCall from "../models/EmergencyCallModel.js";
import AmbulanceDriver from "../models/AmbulanceDriverModel.js";
import Hospital from "../models/HospitalModel.js";
import Patient from "../models/PatientModel.js";
import MedicalRecord from "../models/MedicalRecordModel.js";

export const getDashboard = (req, res) => {};


// {
//     "patientId": "682038e20ec90fbe603ae790",
//     "doctorId": "681dd69935d415c894b6bcd8",
//     "doctorName": "Dr. Alice Smith",
//     "hospitalId": "681dcb32c3809415a8e727ab",
//     "hospitalName": "City General Hospital",
//     "date": "2025-05-13",
//     "timeSlot": 11,
//     "reason": "Fever"
// }


export const bookAppointment = async (req, res) => {
  const { patientId, doctorId, hospitalId, date, timeSlot, reason, doctorName, hospitalName } = req.body;

  try {

    const appointment = new Appointment({
      patient: patientId,
      doctor: doctorId,
      doctorName: doctorName,
      hospital: hospitalId,
      hospitalName: hospitalName,
      date,
      timeSlot,
      reason,
    });

    await appointment.save();

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Failed to book appointment" });
  }
};

export const listAppointments = async (req, res) => {
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

export const updateAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const updates = req.body; // e.g., { date, timeSlot, reason }

    try {
        const appointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            updates,
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment updated", appointment });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Failed to update appointment" });
    }
};

export const cancelAppointment = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        appointment.status = "cancelled";
        await appointment.save();

        res.status(200).json({ message: "Appointment cancelled", appointment });
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({ message: "Failed to cancel appointment" });
    }
};




// Request Emergency
export const requestEmergency = async (req, res) => {
  const { patientId, location } = req.body;

  try {
    // Step 1: Find patient details
    const patient = await Patient.findOne({ user: patientId });
    if (!patient) return res.status(400).json({ message: "Patient not found." });

    // Step 2: Find available ambulance drivers (those who are on duty)
    const ambulanceDrivers = await AmbulanceDriver.find({ onDuty: true });
    if (ambulanceDrivers.length === 0) return res.status(404).json({ message: "No ambulance drivers available." });

    // Step 3: Find nearest hospital with available emergency beds
    const nearestHospital = await Hospital.findOne({ "location.coordinates": { $near: [location.lat, location.long] }, emergencyBeds: { $gt: 0 } }).sort({ "location.coordinates": 1 });
    if (!nearestHospital) return res.status(404).json({ message: "No hospitals with emergency beds available." });

    // Step 4: Create Emergency Call record
    const emergencyCall = new EmergencyCall({
      patient: patient.user,  // Patient's user ID
      driver: null,  // Will be updated once the ambulance driver accepts
      hospital: nearestHospital._id,
      location: {
        lat: location.lat,
        long: location.long,
        address: location.address || "Unknown",  // Defaulting to "Unknown" if address is not provided
      },
      status: "pending",
      active: true,
    });

    await emergencyCall.save();

    // Step 5: Notify ambulance drivers (simulation, you may use a real-time system like Socket.io)
    // For now, we'll just list the available drivers
    const driverIds = ambulanceDrivers.map(driver => driver.user);  // List of user IDs of the drivers
    // Here, you might push an event to notify ambulance drivers in real-time (Socket.io, or any messaging queue system).

    res.status(200).json({
      message: "Emergency request has been created successfully. Ambulance drivers will be notified.",
      emergencyCall,
      availableDrivers: driverIds,  // Example to show who is notified (driver IDs)
    });
  } catch (error) {
    console.error("Error while requesting emergency:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};






export const getMyRecords = async (req, res) => {
  try {
    const { id } = req.params;

    const records = await MedicalRecord.find({ patient: id })
      .populate({
        path: "doctor",
        select: "name", // assuming User model has a 'name' field
      })
      .populate({
        path: "hospital",
        select: "name",
      });

    res.status(200).json(records);
  } catch (error) {
    console.error("Error getMyRecords:", error);
    res.status(500).json({ message: "Failed to fetch getMyRecords" });
  }
};


export const getConsultations = (req, res) => {};




// Helper function to calculate distance using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in kilometers
}

// Find nearest hospital among those with free beds
function findNearestHospital(hospitalList, patientLocation) {
  let nearest = null;
  let minDistance = Infinity;

  for (const entry of hospitalList) {
    const { hospital } = entry;
    if (
        !hospital.location?.coordinates?.lat ||
        !hospital.location?.coordinates?.long
      ) {
          continue; // skip invalid hospital entry
      }

    const dist = getDistance(
      patientLocation.lat,
      patientLocation.long,
      hospital.location.coordinates.lat,
      hospital.location.coordinates.long
    );

    if (dist < minDistance) {
      minDistance = dist;
      nearest = hospital;
    }
  }

  return nearest;
}

// Main controller
export const createEmergency = async (req, res) => {
  try {
    console.log(req.body);
    const { userId: patientId, lat, long, address = "Unknown" } = req.body;
    

    const location = { lat, long, address };

    // 1. Get all hospitals
    const allHospitals = await Hospital.find({});

    const hospitalWithFreeBeds = [];

    for (const hospital of allHospitals) {
      const activeCount = await EmergencyCall.countDocuments({
        hospital: hospital._id,
        status: {
          $in: [
            "accepted",
            "enRouteToPatient",
            "enRouteToHospital",
            "arrivedAtHospital",
            "admitted"
          ]
        },
        active: true
      });

      const availableBeds = hospital.emergencyBeds - activeCount;
      if (availableBeds > 0)
        hospitalWithFreeBeds.push({ hospital, availableBeds });
    }

    if (hospitalWithFreeBeds.length === 0) {
      return res.status(503).json({
        success: false,
        message: "No hospitals with available emergency beds found."
      });
    }

    // 2. Find nearest hospital
    const nearestHospital = findNearestHospital(hospitalWithFreeBeds, location);

    if (!nearestHospital) {
      console.log("Unable to determine nearest hospital.");
      return res.status(500).json({
        success: false,
        message: "Unable to determine nearest hospital."
      });
    }

    console.log('nearestHospital', nearestHospital);

    // 3. Create EmergencyCall
    const newEmergency = await EmergencyCall.create({
      patient: patientId,
      hospital: nearestHospital._id,
      location,
      status: "pending",
      active: true
    });

    // 4. Emit socket to all drivers
    req.io.emit("newEmergency", {
      emergencyId: newEmergency._id,
      patientId,
      location,
      hospital: {
        _id: nearestHospital._id,
        name: nearestHospital.name,
        location: nearestHospital.location
      }
    });

    res.status(201).json({
      success: true,
      message: "Emergency created and drivers notified.",
      emergency: newEmergency
    });
  } catch (error) {
    console.error("Emergency creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};


export const getEmergencyCallModel = async (req, res) => {
    try {
        const { id } = req.params; // adminId 
        if (!id) {
            return res.status(400).json({ error: 'Missing Emergency ID' });
        }
        const emergency = await EmergencyCall.findById(id);
        res.status(200).json(emergency);
    } catch (error) {
        console.error("Error fetching emergency model:", error);
        res.status(500).json({ message: "Failed to fetch emergency model" });
    }
    
}

// GET /api/emergency/by-patient/:patientId

export const getActiveEmergencyByPatient = async (req, res) => {
  try {
    const { id: patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ error: "Missing patient ID" });
    }

    // Active statuses that mean the emergency is still ongoing
    const activeStatuses = [
      "pending",
      "accepted",
      "enRouteToPatient",
      "enRouteToHospital",
    ];

    const emergency = await EmergencyCall.findOne({
      patient: patientId,
      status: { $in: activeStatuses },
      active: true
    })
      .populate("driver", "name phoneNumber vehicleNumber")
      .populate("hospital", "name location")
      .populate("doctor", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(emergency || null);
  } catch (error) {
    console.error("Error fetching active emergency:", error);
    return res.status(500).json({ message: "Server error while fetching active emergency" });
  }
};
