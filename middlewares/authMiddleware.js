// middleware to check if user is authenticated in the session
module.exports = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect("/login");
};

module.exports.ensureExaminer = (req, res, next) => {
  if (req.session.userType === "Examiner") {
    return next();
  }
  res.redirect("/login");
};
