const User = require("../models/User");

module.exports.renderDashboard = async (req, res) => {
  try {
    // Fetch all users with their appointments
    const users = await User.find({ userType: "Driver" }).populate(
      "appointments.appointment_id"
    );
    res.render("admin/dashboard", {
      layout: "admin/dashboard",
      title: "Dashboard",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.viewResults = async (req, res) => {
  try {
    const { filter } = req.query;
    let query = {};

    if (filter === "pass") {
      query.passFail = true;
    } else if (filter === "fail") {
      query.passFail = false;
    }

    const users = await User.find({ userType: "Driver" }).populate(
      "appointments.appointment_id"
    );
    console.log(users);
    res.render("admin/results", {
      layout: "admin/results",
      title: "Results",
      users,
    });
  } catch (err) {
    res.render("admin/results", {
      layout: "admin/results",
      title: "Results",
      users: [],
    });
  }
};
