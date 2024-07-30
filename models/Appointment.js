const mongoose = require("mongoose");

// Define the schema for an appointment
const appointmentSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  isTimeSlotAvailable: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
