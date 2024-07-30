// middleware to check if user is an admin
module.exports = (req, res, next) => {
  if (req.session.userId && req.session.userType === "Admin") {
    next();
  } else {
    res.redirect("/login");
  }
};
