const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const User = require("./models/User");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));

const PORT = 4019;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, "public/index.html"));
  res.render("index");
});

app.get("/G2", (req, res) => {
  res.render("G2");
  // res.sendFile(path.join(__dirname, "public/G2.html"));
});

app.get("/G", async (req, res) => {
  // res.sendFile(path.join(__dirname, "public/G.html"));
  const { licenseNo, updateSuccess } = req.query;
  let user = null;
  let message = null;

  if (licenseNo) {
    user = await User.findOne({ licenseNo });
    if (!user) {
      message = "No User Found";
    } else if (updateSuccess === "true") {
      message = "Car details updated successfully!";
    }
  }
  res.render("G", { user, message });
});

app.get("/login", (req, res) => {
  // res.sendFile(path.join(__dirname, "public/login.html"));
  res.render("login");
});

app.get("/register", (req, res) => {
  // res.sendFile(path.join(__dirname, "public/register.html"));
  res.render("register");
});

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/myDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.post("/addUser", async (req, res) => {
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
    const newUser = new User({
      firstname,
      lastname,
      licenseNo,
      age,
      car_details: {
        make: carMake,
        model: carModel,
        year: carYear,
        platno: plateNumber,
      },
    });
    await newUser.save();
    res.redirect("/g2");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Fetch User Route
app.post("/getUser", async (req, res) => {
  try {
    const user = await User.findOne({ licenseNo: req.body.licenseNo });
    if (!user) {
      return res.render("g", { user: null, message: "No User Found" });
    }
    res.render("g", { user, message: null });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update Car Details Route
app.post("/updateUser/:licenseNo", async (req, res) => {
  try {
    const { make, model, year, platno } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { licenseNo: req.params.licenseNo },
      {
        "car_details.make": make,
        "car_details.model": model,
        "car_details.year": year,
        "car_details.platno": platno,
      },
      { new: true }
    );
    if (!updatedUser) return res.status(404).send("No User Found");
    res.redirect(`/g?licenseNo=${updatedUser.licenseNo}&updateSuccess=true`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
