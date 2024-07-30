const User = require("../models/User");

module.exports = async (req, res, next) => {
  // Check if user is logged in
  if (req.session.userId) {
    // Find the user by id
    const user = await User.findById(req.session.userId);
    // If user exists, set user details to res.locals
    if (user) {
      res.locals.username = user.username;
      res.locals.userType = user.userType;
      res.locals.loggedIn = true;
    }
  }
  // Call the next middleware
  next();
};
