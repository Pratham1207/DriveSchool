const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.renderExaminer = async (req, res) => {
  try {
    const testType = req.query.testType || "";
    const filter = testType ? { testType: testType } : {};
    const appointments = await Appointment.find(filter).populate("user");
    res.render("examinerDashboard", {
      layout: "examinerDashboard",
      title: "Examiner Dashboard",
      appointments,
      testType,
    });
  } catch (error) {
    console.error("Error rendering examiner view:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.addComment = async (req, res) => {
  try {
    const { appointmentId, comment } = req.body;

    // Find the appointment and populate the user field
    const appointment = await Appointment.findById(appointmentId).populate(
      "user"
    );
    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }

    // Check if the user exists
    if (!appointment.user) {
      return res.status(400).send("User not found for this appointment");
    }

    // Add the comment
    appointment.comment = comment;

    // Save the updated appointment
    await appointment.save();

    res.redirect("examinerDashboard");
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send("Server Error");
  }
};

// Update appointment status and comment
exports.updateAppointment = async (req, res) => {
  try {
    const { isPass, comment } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }

    const user = await User.findById(appointment.user);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const userAppointment = user.appointments.id(appointment._id);
    if (!userAppointment) {
      return res.status(404).send("User appointment not found");
    }

    userAppointment.isPass = isPass;
    userAppointment.comment = comment;

    await user.save();
    res.send("Appointment updated successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};
