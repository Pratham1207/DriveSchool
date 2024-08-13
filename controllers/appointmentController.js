// Controllers for managing appointments

// Import Appointment and User models
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// Render the appointment management page
module.exports.renderAppointment = async (req, res) => {
  try {
    // Find all appointments and render the page
    const appointments = await Appointment.find({});
    res.render("admin/appointment", {
      layout: "admin/appointment",
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
    // Extract date, time, and testType from the request body
    const { date, time, testType } = req.body;

    // Convert the provided date to a Date object and check if it's in the future
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set current time to midnight for comparison
    if (appointmentDate < today) {
      return res.render("admin/appointment", {
        layout: "admin/appointment",
        title: "Appointment Management",
        messages: {
          error: "Appointments must be scheduled for a future date.",
        },
      });
    }

    // Check if the time slot for the specified date and test type is already booked
    const existingAppointment = await Appointment.findOne({
      date,
      time,
      testType,
    });
    if (existingAppointment) {
      return res.render("admin/appointment", {
        layout: "admin/appointment",
        title: "Appointment Management",
        messages: { error: "This time slot is already booked." },
      });
    }

    // Ensure the user ID is available in the session
    if (!req.session.userId) {
      return res.render("admin/appointment", {
        layout: "admin/appointment",
        title: "Appointment Management",
        messages: { error: "User not authenticated." },
      });
    }

    // Create a new appointment and save it to the database
    const appointment = new Appointment({
      date,
      time,
      testType,
      user: req.session.userId,
    });
    await appointment.save();

    // Find the user by ID and associate the appointment with the user
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.render("admin/appointment", {
        layout: "admin/appointment",
        title: "Appointment Management",
        messages: { error: "User not found." },
      });
    }

    // Push the appointment ID to the user's appointments array and save the user
    user.appointments.push(appointment._id);
    await user.save();

    // Render the success message after the appointment is created
    res.render("admin/appointment", {
      layout: "admin/appointment",
      title: "Appointment Management",
      messages: { success: "Appointment successfully created!" },
    });
  } catch (error) {
    // Handle any unexpected errors by rendering the error message
    res.render("admin/appointment", {
      layout: "admin/appointment",
      title: "Appointment Management",
      messages: { error: error.message },
    });
  }
};

//  Book an appointment
module.exports.bookAppointment = async (req, res) => {
  try {
    // Extract time and testType from request body
    const { time, testType } = req.body;

    // Find the appointment by its date, time, and testType
    const appointment = await Appointment.findOne({ time, testType });

    // Check if the appointment exists and if it's available
    if (!appointment || !appointment.isTimeSlotAvailable) {
      return res.status(400).send("This time slot is no longer available.");
    }

    // Mark the time slot as unavailable
    appointment.isTimeSlotAvailable = false;
    await appointment.save();

    // Find the user and associate the appointment with them
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    user.appointments.push(appointment._id);
    await user.save();

    // Redirect to the profile page
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Get available time slots for a given date
module.exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const slots = await Appointment.find({ date });
    const availableSlots = slots.filter((slot) => slot.isTimeSlotAvailable);
    res.json({ slots: availableSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
