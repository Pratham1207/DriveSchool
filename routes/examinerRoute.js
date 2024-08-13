const express = require("express");
const router = express.Router();

const examinerController = require("../controllers/examinerController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
  "/examinerDashboard",
  authMiddleware.ensureExaminer,
  examinerController.renderExaminer
);
router.post(
  "/addcomment",
  authMiddleware.ensureExaminer,
  examinerController.addComment
);

// Update appointment status and comment
router.put("/appointment/:appointmentId", examinerController.updateAppointment);

module.exports = router;
