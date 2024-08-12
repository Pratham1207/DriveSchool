/**
 * User routes
 *
 * This file contains all the routes related to user. It only handles POST requests.
 * All the routes are protected by the authentication middleware, which means the user
 * must be logged in to access them.
 */
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * Update a user
 *
 * This route updates a user in the database. The user data should be sent in the
 * request body. The user must be logged in to access this route.
 */
router.post("/updateUser", authMiddleware, userController.updateUser);
router.post("/updateGUser", authMiddleware, userController.updateGUser);

/**
 * Get a user
 *
 * This route returns a user from the database. The user ID should be sent in the
 * request body. The user must be logged in to access this route.
 */
router.post("/getUser", authMiddleware, userController.getUser);

module.exports = router;
