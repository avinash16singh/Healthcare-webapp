import AmbulanceDriver from "../models/AmbulanceDriverModel.js";
import EmergencyCall from "../models/EmergencyCallModel.js";

export const getDashboard = (req, res) => {};


export const getDriverModel = async (req, res) => {
    try {
        const { id } = req.params; // adminId 
        if (!id) {
            return res.status(400).json({ error: 'Missing hospitalAdmin ID' });
        }
        const driver = await AmbulanceDriver.findOne({ user: id });
        res.status(200).json(driver);
    } catch (error) {
        console.error("Error fetching driver model:", error);
        res.status(500).json({ message: "Failed to fetch driver model" });
    }
    
}

export const acceptNewEmergencyCase = async (req, res) => {
    const {emergencyId, driverId} = req.body;
    try {
    const emergency = await EmergencyCall.findByIdAndUpdate(emergencyId, {
      driver: driverId,
      status: "accepted",
    });
    res.status(200).json({ success: true, message: "Emergency accepted.", emergency});
  } catch (err) {
    console.error("Error assigning driver:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const getEmergencyCalls = (req, res) => {};
export const updateEmergencyCallStatus = (req, res) => {};




export const myActiveCases = async (req, res) => {
  try {
    const { id: driverId } = req.params;

    if (!driverId) {
      return res.status(400).json({ error: "Missing driver ID" });
    }

    // Active statuses that mean the emergency is still ongoing
    const activeStatuses = [
      "pending",
      "accepted",
      "enRouteToPatient",
      "enRouteToHospital",
    ];

    const emergency = await EmergencyCall.findOne({
      driver: driverId,
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



export const myPastCases = async (req, res) => {
  try {
    const { id: driverId } = req.params;

    if (!driverId) {
      return res.status(400).json({ error: "Missing driver ID" });
    }

    const emergencies = await EmergencyCall.find({
      driver: driverId
    })
      .populate("driver", "name phoneNumber vehicleNumber")
      .populate("hospital", "name location")
      .populate("doctor", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(emergencies || null);
  } catch (error) {
    console.error("Error fetching active emergency:", error);
    return res.status(500).json({ message: "Server error while fetching active emergency" });
  }
};

export const getUnclaimedCases = async (req, res) => {
  try {
    const emergencies = await EmergencyCall.find({
      driver: null
    })
      .populate("hospital", "name location")
      .populate("doctor", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(emergencies || null);
  } catch (error) {
    console.error("Error fetching active emergency:", error);
    return res.status(500).json({ message: "Server error while fetching active emergency" });
  }
};