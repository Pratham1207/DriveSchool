const Appointment = require("../models/Appointment"); // Adjust path as needed

exports.renderExaminer = async (req, res) => {
  try {
    const appointments = await Appointment.find(); // Fetch all appointments
    res.render("examiner", { title: "Examiner", appointments }); // Pass appointments to the EJS template
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
