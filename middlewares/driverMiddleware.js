// middleware to check if user is a driver
module.exports = (req, res, next) => {
  if (req.session.userType !== "Driver") {
    return res.redirect("/");
  }
  next();
};
