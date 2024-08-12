const mongoose = require("mongoose");

// Database connection
const dbConfig = () => {
  const dbURI =
    process.env.MONGO_URI ||
    "mongodb+srv://admin:root123@test.dxddbd2.mongodb.net/?retryWrites=true&w=majority&appName=test";

  mongoose
    .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
};

module.exports = dbConfig;
