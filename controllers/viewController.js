const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Render the index page
exports.renderIndex = (req, res) => {
  res.render("index", { layout: "index", title: "Home" });
};

// Render the G2 page with the user's information
exports.renderG2 = async (req, res) => {
  try {
    // Find the user by their session ID
    const user = await User.findById(req.session.userId);
    // Render the G2 page with the user's information
    res.render("G2", {
      layout: "G2",
      title: "G2 Test",
      user,
    });
  } catch (err) {
    // If there's an error, send a 500 error message
    res.status(500).send(err.message);
  }
};

// Render the G page with the user's information
exports.renderG = async (req, res) => {
  try {
    // Find the user by their session ID
    const user = await User.findById(req.session.userId);
    // Render the G page with the user's information
    res.render("G", { layout: "G", title: "G Test", user: req.session.user });
  } catch (err) {
    // If there's an error, send a 500 error message
    res.status(500).send(err.message);
  }
};

// Render the login page
exports.renderLogin = (req, res) => {
  res.render("login", { layout: "login", title: "Login" });
};

// Render the register page
exports.renderRegister = (req, res) => {
  res.render("register", { layout: "register", title: "Register" });
};

// Render the profile page
module.exports.renderProfile = async (req, res) => {
  const userId = req.session.userId || "testUserId";
  const userName = await User.findById(req.session.userId);
  const user = await User.findById(userId).populate("appointments");
  res.render("profile", {
    layout: "profile",
    title: "Profile",
    userName,
    appointments: user.appointments,
  });
};

// Render the appointment page
exports.renderAppointment = (req, res) => {
  res.render("appointment", { layout: "appointment", title: "Appointment" });
};

// Get available time slots for a given date

exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const slots = await Appointment.find({ date });
    // filter out unavailable slots
    const availableSlots = slots.filter((slot) => slot.isTimeSlotAvailable);
    res.json({ slots: availableSlots });
  } catch (error) {
    // send internal server error
    res.status(500).json({ message: error.message });
  }
};

// Book an appointment
exports.bookSlot = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findOne({ date, time });

    if (!appointment || !appointment.isTimeSlotAvailable) {
      // time slot is not available
      return res.status(400).json({
        message: "This time slot is no longer available.",
        success: false,
      });
    }

    // mark time slot as unavailable
    appointment.isTimeSlotAvailable = false;
    await appointment.save();

    // associate appointment with user
    const user = await User.findById(req.session.userId);
    if (user) {
      user.appointments = appointment._id;
      await user.save();
    }

    // send success message
    res.json({ message: "Appointment booked successfully!", success: true });
  } catch (error) {
    // send internal server error
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.renderExaminer = async (req, res) => {
  try {
    const appointments = await Appointment.find(); // Fetch all appointments
    res.render("examiner", {
      layout: "examiner",
      title: "Examiner",
      appointments,
    }); // Pass 'appointments' to the EJS template
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
