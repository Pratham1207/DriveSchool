// Import User model
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Update user's details
exports.updateUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      licenseNo,
      age,
      carMake,
      carModel,
      carYear,
      plateNumber,
    } = req.body;

    // Update user
    const userName = await User.findByIdAndUpdate(
      req.session.userId,
      {
        firstname,
        lastname,
        licenseNo,
        age,
        "car_details.make": carMake,
        "car_details.model": carModel,
        "car_details.year": carYear,
        "car_details.platno": plateNumber,
      },
      { new: true }
    );

    if (!userName) {
      return res.status(404).send("User not found");
    }

    const appointments = await Appointment.find({
      _id: { $in: userName.appointments },
    });
    // Redirect to profile page or send a response
    res.render("profile", {
      layout: "profile",
      title: "Profile",
      userName,
      appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Get user's details
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Fetch user's appointments
    const appointments = await Appointment.find({
      _id: { $in: user.appointments },
    });

    // Send user data and appointments as JSON
    res.json({ user, appointments });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
