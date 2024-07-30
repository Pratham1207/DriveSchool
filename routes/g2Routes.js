// This file sets up the routes for the G2 functionality

// Import necessary modules
const express = require("express");
const router = express.Router();
const g2Controller = require("../controllers/g2Controller");

// Define the GET route for fetching available slots
// The URL parameter ':date' is used to specify the date for which slots are to be fetched
router.get("/slots/:date", g2Controller.getAvailableSlots);

// Define the POST route for booking a slot
// This route is used to book a slot for a specific date
router.post("/book", g2Controller.bookSlot);

// Export the router to be used in the main app.js file
module.exports = router;
