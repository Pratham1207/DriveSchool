const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AppointmentSchema = new mongoose.Schema({
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
  },
  testType: {
    type: String,
    default: "",
  },
  isPass: {
    type: Boolean,
    default: null,
  },
  comment: {
    type: String,
    default: "",
  },
});

// Define the schema for a user
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  firstname: { type: String, default: "defaultFirstname" },
  lastname: { type: String, default: "defaultLastname" },
  licenseNo: {
    type: String,
    default: "defaultLicenseNo",
  },
  age: {
    type: Number,
    default: 0,
  },
  car_details: {
    make: {
      type: String,
      default: "defaultMake",
    },
    model: {
      type: String,
      default: "defaultModel",
    },
    year: {
      type: Number,
      default: 0,
    },
    platno: {
      type: String,
      default: "defaultPlatno",
    },
  },

  // appointments should be an array of AppointmentSchema objects
  appointments: {
    type: [AppointmentSchema],
    default: [],
  },
});

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Find a user by their credentials
UserSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("Invalid login credentials");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid login credentials");
  }
  return user;
};

// Create a model for the user schema
const User = mongoose.model("User", UserSchema);

// Export the User model
module.exports = User;
