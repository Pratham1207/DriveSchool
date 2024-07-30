// Redirect if user is authenticated in the session
module.exports = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect("/");
  }
  next();
};
