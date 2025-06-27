import express from "express";
const router = express.Router();

import {
  getDashboard,
  listAppointments,
  listDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  listPatients,
  listAmbulances,
  createAmbulance,
  updateAmbulance,
  deleteAmbulance,
  getEmergencyDashboard,
  getHospitalModel
} from "../controllers/hospitalController.js";


router.get("/:id", getHospitalModel);

router.get("/dashboard", getDashboard);
router.get("/appointments/:id", listAppointments);

router.get("/doctors/:id", listDoctors);
router.post("/doctors", createDoctor);
router.put("/doctors/:id", updateDoctor);
router.delete("/doctors/:id", deleteDoctor);

router.get("/patients", listPatients);

router.get("/ambulances/:id", listAmbulances);
router.post("/ambulances", createAmbulance);
router.put("/ambulances/:id", updateAmbulance);
router.delete("/ambulances/:id", deleteAmbulance);

router.get("/emergencies", getEmergencyDashboard);

// router.get("/profile", getProfile);
// router.post("/settings", updateSettings);

export default router;
