function updateExpirationDate() {
  const conclusionDate = document.getElementById(
    "date-of-conclusion-input"
  ).value;
  if (conclusionDate) {
    const conclusionDateObj = new Date(conclusionDate);

    conclusionDateObj.setFullYear(conclusionDateObj.getFullYear() + 1); // Add 1 year
    conclusionDateObj.setDate(conclusionDateObj.getDate() - 1); // Subtract 1 day

    const formattedExpirationDate = conclusionDateObj
      .toISOString()
      .split("T")[0];

    document.getElementById("date-of-expiration-input").value =
      formattedExpirationDate;
  }
}

function updateMonthInfo() {
  const conclusionDate = document.getElementById(
    "date-of-conclusion-input"
  ).value;

  window.moment.format(conclusionDate, "MMMM").then((date) => {
    document.getElementById("month-input-info").innerHTML =
      date.charAt(0).toUpperCase() + date.slice(1).toLowerCase();
  });
}

updateExpirationDate();

updateMonthInfo();

document
  .getElementById("date-of-conclusion-input")
  .addEventListener("change", updateExpirationDate);

document
  .getElementById("date-of-conclusion-input")
  .addEventListener("change", updateMonthInfo);

document.getElementById("search-by-month-input")
.addEventListener("change", () => {
  console.log("Event geldi");
  
  loadRecords()
})

function adjustStickyRows() {
  const stickyRows = document.querySelectorAll(".primary-tr, .input-row");

  let cumulativeOffset = 0;

  stickyRows.forEach((row) => {
    row.style.top = `${cumulativeOffset}px`;

    const rowHeight = row.offsetHeight;
    cumulativeOffset += rowHeight;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  adjustStickyRows();

  window.addEventListener("resize", adjustStickyRows);
});

document.addEventListener("click", () => {
  document.getElementById("context-menu").classList.add("hidden");
  document.querySelectorAll(".selected-row").forEach((selectedRow) => {
    selectedRow.classList.remove("selected-row")
  })
});

document.addEventListener("scroll", () => {
  document.getElementById("context-menu").classList.add("hidden");
  document.querySelectorAll(".selected-row").forEach((selectedRow) => {
    selectedRow.classList.remove("selected-row")
  })
});

document
  .getElementById("correct-record-btn")
  .addEventListener("click", async () => {
    document.getElementById("month-input-info").innerHTML =
      selectedRecord.month_as_text;
    document.getElementById("id-input").value = selectedRecord.policy_number;
    document.getElementById("license-plate-input").value =
      selectedRecord.license_plate;
    document.getElementById("fullname-input").value = selectedRecord.fullname;
    document.getElementById("date-of-conclusion-input").value =
      await window.moment.formatFormatted(
        selectedRecord.date_of_conclusion,
        "DD.MM.YYYY",
        "YYYY-MM-DD"
      );
    document.getElementById("payment-input").value =
      selectedRecord.number_of_payments;
    document.getElementById("dates-for-payment-inputinfo").innerHTML =
      selectedRecord.dates_for_payment;
    document.getElementById("date-of-expiration-input").value =
      await window.moment.formatFormatted(
        selectedRecord.date_of_expiration,
        "DD.MM.YYYY",
        "YYYY-MM-DD"
      );
    document.getElementById("pnumber-input").value =
      selectedRecord.phone_number;
    document.getElementById("discount-input").value = selectedRecord.discount;
    document.getElementById("price-input").value = selectedRecord.price;
  });

document
  .getElementById("delete-record-btn")
  .addEventListener("click", async () => {
    let id = selectedRecord.policy_number;

    if (id == "") {
      return;
    }

    window.api
      .deleteRecord(id)
      .then((res) => {
        clearMemory();

        loadRecords();
      })
      .catch((err) => {
        console.error(err);
      });
  });
