// This file sets up the routes for rendering different views
const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const examinerMiddleware = require("../middlewares/examinerMiddleware");
const redirectIfAuthenticatedMiddleware = require("../middlewares/redirectIfAuthenticatedMiddleware");

// Render the index page
router.get("/", viewController.renderIndex);

// Render the G2 page, which requires authentication
router.get("/G2", authMiddleware, viewController.renderG2);

// Render the G page, which requires authentication
router.get("/G", authMiddleware, viewController.renderG);

// Render the login page, which requires the user to be not authenticated
router.get(
  "/login",
  redirectIfAuthenticatedMiddleware,
  viewController.renderLogin
);

// Render the register page, which requires the user to be not authenticated
router.get(
  "/register",
  redirectIfAuthenticatedMiddleware,
  viewController.renderRegister
);

// Render the profile page, which requires authentication
router.get("/profile", authMiddleware, viewController.renderProfile);

// Render the appointment page, which requires admin privileges
router.get("/appointment", adminMiddleware, viewController.renderAppointment);

router.get("/examiner", examinerMiddleware, viewController.renderExaminer);

router.get("/slots/:date", viewController.getAvailableSlots);

router.post("/book", viewController.bookSlot);

module.exports = router;
