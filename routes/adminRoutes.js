const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Admin Routes
router.get("/", adminMiddleware, adminController.renderDashboard);

// Results
router.get("/results", adminMiddleware, adminController.viewResults);

module.exports = router;
