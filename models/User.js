const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  age: { type: Number, required: true },
  licenseNo: { type: String, required: true, unique: true },
  car_details: {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    platno: { type: String, required: true },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
