// Get available time slots for a given date

module.exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const slots = await Appointment.find({ date });
    // filter out unavailable slots
    const availableSlots = slots.filter((slot) => slot.isTimeSlotAvailable);
    res.json({ slots: availableSlots });
  } catch (error) {
    // send internal server error
    res.status(500).json({ message: error.message });
  }
};

// Book an appointment
module.exports.bookSlot = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findOne({ date, time });

    if (!appointment || !appointment.isTimeSlotAvailable) {
      // time slot is not available
      return res.status(400).json({
        message: "This time slot is no longer available.",
        success: false,
      });
    }

    // mark time slot as unavailable
    appointment.isTimeSlotAvailable = false;
    await appointment.save();

    // associate appointment with user
    const user = await User.findById(req.session.userId);
    if (user) {
      user.appointments = appointment._id;
      await user.save();
    }

    // send success message
    res.json({ message: "Appointment booked successfully!", success: true });
  } catch (error) {
    // send internal server error
    res.status(500).json({ message: error.message, success: false });
  }
};
