// Controllers for user authentication and registration
const User = require("../models/User");

// Register a new user
exports.register = async (req, res) => {
  try {
    // Extract user details from request body
    const { username, password, userType } = req.body;
    // Create a new user instance
    const user = new User({ username, password, userType });
    // Save the user to the database
    await user.save();
    // Redirect to the login page
    res.redirect("/login");
  } catch (err) {
    // Handle registration errors
    res.status(400).send(err.message);
  }
};

// Log in a user
exports.login = async (req, res) => {
  try {
    // Extract user details from request body
    const { username, password } = req.body;
    // Find the user by credentials
    const user = await User.findByCredentials(username, password);
    // Check if the user exists
    if (!user) {
      return res.status(400).send("Invalid login credentials");
    }
    // Store the user ID and user type in the session
    req.session.userId = user._id;
    req.session.userType = user.userType;
    // Redirect to the home page
    res.redirect("/");
  } catch (err) {
    // Handle login errors
    res.status(400).send(err.message);
  }
};

// Log out the current user
exports.logout = (req, res) => {
  // Destroy the user session
  req.session.destroy(() => {
    // Redirect to the home page
    res.redirect("/");
  });
};
