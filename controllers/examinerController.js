const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.renderExaminer = async (req, res) => {
  try {
    const testType = req.query.testType || "";
    const query = testType ? { testType } : {};
    const appointments = await Appointment.find(query).populate("user");
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
