// This file sets up the routes for managing appointments
const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const Appointment = require("../models/Appointment");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Render the appointment management page
router.get(
  "/admin/appointment",
  adminMiddleware,
  appointmentController.renderAppointment
);

// Create an appointment
router.post(
  "/create-appointment",
  adminMiddleware,
  appointmentController.createAppointment
);

router.get("/slots/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const appointments = await Appointment.find({
      date,
      isTimeSlotAvailable: true,
    }).exec();
    res.json({ slots: appointments });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Error fetching slots" });
  }
});

// Handle booking
router.post("/book", async (req, res) => {
  try {
    const { date, slotId } = req.body;
    const appointment = await Appointment.findById(slotId);
    if (appointment && appointment.isTimeSlotAvailable) {
      appointment.isTimeSlotAvailable = false;
      await appointment.save();
      res.json({ success: true, message: "Slot booked successfully" });
    } else {
      res.json({ success: false, message: "Slot is not available" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error booking slot" });
  }
});

module.exports = router;
