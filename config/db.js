const mongoose = require("mongoose");

// Database connection
const dbConfig = () => {
  const dbURI =
    process.env.MONGO_URI || "mongodb://localhost:27017/DriveSystem";

  mongoose
    .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
};

module.exports = dbConfig;
