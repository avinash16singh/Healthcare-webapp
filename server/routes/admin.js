import express from "express";
const router = express.Router();

import {
  getDashboard,
  listHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
  listHospitalAdmins,
  createHospitalAdmin,
  updateHospitalAdmin,
  deleteHospitalAdmin,
  listAmbulanceDrivers,
  getAnalytics,
} from "../controllers/adminController.js";

router.get("/dashboard", getDashboard);
router.get("/hospitals", listHospitals);
router.post("/hospitals", createHospital);
router.put("/hospitals/:id", updateHospital);
router.delete("/hospitals/:id", deleteHospital);

router.get("/hospital-admins", listHospitalAdmins);
router.post("/hospital-admins", createHospitalAdmin);
router.put("/hospital-admins/:id", updateHospitalAdmin);
router.delete("/hospital-admins/:id", deleteHospitalAdmin);

router.get("/ambulance-drivers", listAmbulanceDrivers);
router.get("/analytics", getAnalytics);

// router.get("/profile", getProfile);
// router.post("/settings", updateSettings);

export default router;






// import { auth } from "../middleware/auth.js";
// import { authorizeRoles } from "../middleware/role.js";

// router.post("/admin-only-action", auth, authorizeRoles('centralAdmin'), controllerFunction);
