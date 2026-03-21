const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applicationController");

const protect = require("../middleware/authMiddleware");

/* ROUTES */

router.post("/apply", protect, applicationController.applyDrive);

router.get("/", protect, applicationController.getApplications);

router.put("/:id", protect, applicationController.updateStatus);

module.exports = router;