const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get("/", adminMiddleware, adminController.renderDashboard);

router.get("/results", adminMiddleware, adminController.viewResults);

module.exports = router;
