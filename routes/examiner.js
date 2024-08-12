const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewController"); // Adjust path as needed

router.get("/examiner", viewController.renderExaminer);

module.exports = router;
