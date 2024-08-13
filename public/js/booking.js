$(document).ready(function () {
  let selectedDate = null;
  let selectedSlotId = null;

  $("#calendar").change(function () {
    selectedDate = $(this).val();
    fetchAvailableSlots(selectedDate);
  });

  function fetchAvailableSlots(date) {
    $.get(`/g2/slots/${date}`, function (data) {
      let slotsContainer = $("#slots-container");
      slotsContainer.empty();
      data.slots.forEach((slot) => {
        if (slot.isTimeSlotAvailable) {
          slotsContainer.append(
            `<button type="button" class="btn btn-primary m-1" onclick="selectSlot('${slot._id}', '${slot.time}')">${slot.time}</button>`
          );
        }
      });
    });
  }

  window.selectSlot = function (id, time) {
    selectedSlotId = id;
    alert(
      `You have selected ${time} on ${selectedDate}. Click "Book Appointment" to confirm.`
    );
  };

  $("#book-appointment").click(function () {
    if (selectedDate && selectedSlotId) {
      confirmBooking(selectedDate, selectedSlotId);
    } else {
      alert("Please select a date and time slot.");
    }
  });

  function confirmBooking(date, slotId) {
    if (confirm(`Do you want to book this slot on ${date}?`)) {
      bookSlot(date, slotId);
    }
  }

  function bookSlot(date, slotId) {
    $.post("/g2/book", { date, slotId }, function (response) {
      if (response.success) {
        alert(response.message);
        fetchAvailableSlots(date); // Refresh available slots
      } else {
        alert(response.message);
      }
    });
  }
});
