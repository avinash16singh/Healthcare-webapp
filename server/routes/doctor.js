import express from "express";
const router = express.Router();

import {
  getDashboard,
  getMyAppointments,
  updateAppointmentStatus,
  getEmergencyCases,
  updateEmergencyStatus,
  getMedicalRecords,
  createMedicalRecord,
  updateMedicalRecord,
  getDoctorModel,
  getMedicalRecordByApptId
} from "../controllers/doctorController.js";


router.get("/doctor-model/:id", getDoctorModel);

router.get("/dashboard", getDashboard);
router.get("/appointments", getMyAppointments);
router.put("/appointments/:id/status", updateAppointmentStatus);

router.get("/emergencies", getEmergencyCases);
router.put("/emergencies/:id/status", updateEmergencyStatus);

router.get("/records", getMedicalRecords);
router.post("/records", createMedicalRecord);
router.put("/records/:id", updateMedicalRecord);
router.get("/records/:id", getMedicalRecordByApptId);

// router.get("/profile", getProfile);

export default router;
