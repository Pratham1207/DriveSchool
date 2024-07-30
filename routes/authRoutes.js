// Define the routes for user authentication
const express = require("express"); // Express.js framework
const router = express.Router(); // Create a new router
const authController = require("../controllers/authController"); // Import the authentication controller
const redirectIfAuthenticatedMiddleware = require("../middlewares/redirectIfAuthenticatedMiddleware"); // Import the middleware to redirect if user is authenticated

// Route for registering a new user
router.post(
  "/register",
  redirectIfAuthenticatedMiddleware,
  authController.register
);

// Route for logging in an existing user
router.post("/login", redirectIfAuthenticatedMiddleware, authController.login);

// Route for logging out a user
router.get("/logout", authController.logout);

// Export the router for use in other files
module.exports = router;
