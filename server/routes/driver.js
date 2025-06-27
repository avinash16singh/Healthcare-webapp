import express from "express";
const router = express.Router();

import {
  acceptNewEmergencyCase,
  getDashboard,
  getDriverModel,
  getEmergencyCalls,
  getUnclaimedCases,
  myActiveCases,
  myPastCases,
  updateEmergencyCallStatus,
} from "../controllers/driverController.js";

router.get("/dashboard", getDashboard);
router.get("/:id", getDriverModel);
router.get("/emergencies", getEmergencyCalls);
router.put("/emergencies/:id/status", updateEmergencyCallStatus);


router.put("/emergencies/accept-new", acceptNewEmergencyCase);
router.get("/emergencies/by-user/:id", myActiveCases);
router.get("/emergencies/past/:id", myPastCases);
router.get("/emergencies/unclaimed", getUnclaimedCases);



// router.get("/profile", getProfile);

export default router;
