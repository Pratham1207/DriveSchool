const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const dbConfig = require("./config/db");
const sessionConfig = require("./config/session");
const appointmentRoutes = require("./routes/appointmentRoutes");
const examinerRoutes = require("./routes/examinerRoute");
const adminRoutes = require("./routes/adminRoutes");

// Express setup
const app = express();

const PORT = process.env.PORT || 4019;

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "layouts/navbar");

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(require("./middlewares/setUserMiddleware"));

// Database connection
dbConfig();

// Global variables
app.use("*", (req, res, next) => {
  res.locals.loggedIn = req.session.userId;
  res.locals.userType = req.session.userType;
  next();
});

// Static files
app.use("/styles", express.static(__dirname + "/public/styles"));
app.use("/scripts", express.static(__dirname + "/public/scripts"));

// Routes
app.use("/", require("./routes/viewRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/", appointmentRoutes);
app.use("/g2", appointmentRoutes);
app.use("/admin", adminRoutes);
app.use("/", examinerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
