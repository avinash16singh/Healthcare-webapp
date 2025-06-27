import express from "express";
const router = express.Router();

import {
  getDashboard,
  bookAppointment,
  listAppointments,
  updateAppointment,
  cancelAppointment,
  requestEmergency,
  getMyRecords,
  getConsultations,
  createEmergency,
  getEmergencyCallModel,
  getActiveEmergencyByPatient,
} from "../controllers/patientController.js";

router.get("/dashboard", getDashboard);

router.post("/appointments", bookAppointment);
router.get("/appointments", listAppointments);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", cancelAppointment);

router.post("/emergency", requestEmergency);
router.post("/emergency/create-new", createEmergency);

router.get("/emergencies/:id", getEmergencyCallModel);
router.get("/emergencies/by-user/:id", getActiveEmergencyByPatient);

router.get("/records/:id", getMyRecords);
router.get("/consultations", getConsultations);

// router.get("/profile", getProfile);

export default router;
