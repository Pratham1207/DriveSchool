// This file sets up the routes for managing appointments
const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// Render the appointment management page
router.get("/appointment", appointmentController.renderAppointment);

// Create an appointment
router.post("/create-appointment", appointmentController.createAppointment);

// Book an appointment
router.post("/book-appointment", appointmentController.bookAppointment);

module.exports = router;
