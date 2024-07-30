// Controllers for managing appointments

// Import Appointment and User models
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// Render the appointment management page
module.exports.renderAppointment = async (req, res) => {
  try {
    // Find all appointments and render the page
    const appointments = await Appointment.find({});
    res.render("appointment", {
      title: "Appointment Management",
      appointments,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Create a new appointment
module.exports.createAppointment = async (req, res) => {
  try {
    // Extract date and time from request body
    const { date, time } = req.body;

    // Convert date to a Date object and check if it's in the future
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res
        .status(400) // Send a 400 status code for bad request
        .send("Appointments must be scheduled for a future date.");
    }

    // Check if the time slot is already booked
    const existingAppointment = await Appointment.findOne({ date, time });
    if (existingAppointment) {
      return res.status(400).send("This time slot is already booked.");
    }

    // Create a new appointment and save it to the database
    const appointment = new Appointment({
      date,
      time,
      isTimeSlotAvailable: true,
    });
    await appointment.save();
    res.redirect("/appointment");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//  Book an appointment
module.exports.bookAppointment = async (req, res) => {
  try {
    // Extract time from request body
    const { time } = req.body;
    // Find the appointment by its id
    const appointment = await Appointment.findById(time);
    // Check if the appointment exists and if it's available
    if (!appointment || !appointment.isTimeSlotAvailable) {
      return res.status(400).send("This time slot is no longer available.");
    }
    // Mark the time slot as unavailable
    appointment.isTimeSlotAvailable = false;
    await appointment.save();
    // Find the user and associate the appointment with them
    const user = await User.findById(req.session.userId);
    user.appointments.push(appointment._id);
    await user.save();
    // Redirect to the profile page
    res.redirect("/profile");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
