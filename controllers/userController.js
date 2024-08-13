// Import User and Appointment models
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Update user's details for G2 Test
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

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
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
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    // If appointments need to be updated, adjust the logic accordingly
    const updatedAppointments = await Appointment.updateMany(
      {
        _id: { $in: updatedUser.appointments.map((app) => app.appointment_id) },
      },
      { $set: { testType: "G2" } }
    );

    const appointments = await Appointment.find({
      _id: { $in: updatedUser.appointments.map((app) => app.appointment_id) },
    });

    // Redirect to the profile page or send a response
    res.render("profile", {
      title: "Profile",
      user: updatedUser,
      appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Update user's details for G Test
exports.updateGUser = async (req, res) => {
  try {
    const { carMake, carModel, carYear, plateNumber } = req.body;

    // Update user details and set G test type in appointments array
    const updatedUser = await User.findByIdAndUpdate(
      req.session.userId,
      {
        "car_details.make": carMake,
        "car_details.model": carModel,
        "car_details.year": carYear,
        "car_details.platno": plateNumber,
        $set: { "appointments.$[elem].testType": "G" },
      },
      {
        new: true,
        arrayFilters: [{ "elem.testType": { $exists: true } }],
      }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    const appointments = await Appointment.find({
      _id: { $in: updatedUser.appointments.map((app) => app.appointment_id) },
    });

    // Redirect to profile page or send a response
    res.render("profile", {
      layout: "profile",
      title: "Profile",
      user: updatedUser,
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
      _id: { $in: user.appointments.map((app) => app.appointment_id) },
    });

    // Send user data and appointments as JSON
    res.json({ user, appointments });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
