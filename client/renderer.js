const dateInput = document.getElementById("date-of-conclusion-input");
const today = new Date();
window.moment.format(today, "YYYY-MM-DD").then((data) => {
  dateInput.value = data;
});

let selectedRecord = {};

function clearMemory() {
  document.querySelectorAll(".info-item").forEach((element) => {
    element.remove();
  });
}

function addElements(data) {
  data.forEach((record) => {
    const table = document.getElementById("maintable");

    const newRow = document.createElement("tr");

    const monthTh = document.createElement("th");
    // Номер на полица
    const idTh = document.createElement("th");
    // Регистрационен номер
    const licensePlateTh = document.createElement("th");
    // Име
    const fullnameTh = document.createElement("th");
    // Дата на сключване
    const dateTh = document.createElement("th");
    // Дата на изтичане
    const dateExpTh = document.createElement("th");
    // Брой вноски
    const numPaymentsTh = document.createElement("th");
    const datesForPaymentTh = document.createElement("th");
    const phoneNumberTh = document.createElement("th");
    const discountTh = document.createElement("th");
    const priceTh = document.createElement("th");

    console.log(monthTh.textContent);
    
    monthTh.textContent = record.month_as_text;
    // monthTh.title = "Месец";
    monthTh.classList.add("col-1");
    monthTh.classList.add("data-th");

    idTh.textContent = record.policy_number;
    // idTh.title = "Номер на полица";
    idTh.classList.add("col-2");
    idTh.classList.add("data-th");

    licensePlateTh.textContent = record.license_plate;
    // licensePlateTh.title = "Регистрационен номер";
    licensePlateTh.classList.add("col-3");
    licensePlateTh.classList.add("data-th");
    
    fullnameTh.textContent = record.fullname;
    // fullnameTh.title = "Име";
    fullnameTh.classList.add("col-4");
    fullnameTh.classList.add("data-th");

    dateTh.textContent = record.date_of_conclusion;
    // dateTh.title = "Дата на сключване";
    dateTh.classList.add("col-5");
    dateTh.classList.add("data-th");

    numPaymentsTh.textContent = record.number_of_payments;
    // numPaymentsTh.title = "Вноски";
    numPaymentsTh.classList.add("col-6");
    numPaymentsTh.classList.add("data-th");

    datesForPaymentTh.textContent = record.dates_for_payment;
    // datesForPaymentTh.title = "Дати за плащане";
    datesForPaymentTh.classList.add("col-7");
    datesForPaymentTh.classList.add("data-th");

    dateExpTh.textContent = record.date_of_expiration;
    // dateExpTh.title = "Дата на изтичане";
    dateExpTh.classList.add("col-8");
    dateExpTh.classList.add("data-th");

    phoneNumberTh.textContent = record.phone_number;
    // phoneNumberTh.title = "Тел. номер";
    phoneNumberTh.classList.add("col-9");
    phoneNumberTh.classList.add("data-th");

    discountTh.textContent = record.discount;
    // discountTh.title = "Намаление";
    discountTh.classList.add("col-10");
    discountTh.classList.add("data-th");

    priceTh.textContent = record.price;
    // discountTh.title = "Намаление";
    priceTh.classList.add("col-11");
    priceTh.classList.add("data-th");

    //datesForPaymentTh.textContent = e.dates_for_payment.replace(/ /g, ' <br>');
    datesForPaymentTh.innerHTML = record.dates_for_payment.replace(/ /g, " <br>");

    newRow.appendChild(monthTh);
    newRow.appendChild(idTh);
    newRow.appendChild(licensePlateTh);
    newRow.appendChild(fullnameTh);
    newRow.appendChild(dateTh);
    newRow.appendChild(numPaymentsTh);
    newRow.appendChild(datesForPaymentTh);
    newRow.appendChild(dateExpTh);
    newRow.appendChild(phoneNumberTh);
    newRow.appendChild(discountTh);
    newRow.appendChild(priceTh);
    newRow.classList.add("info-item");

    newRow.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      document.querySelectorAll(".selected-row").forEach((selectedRow) => {
        selectedRow.classList.remove("selected-row")
      })
      selectedRecord = record;
      console.log(event);
      event.target.parentElement.classList.add("selected-row")
      document.getElementById("context-menu").style.top = event.clientY + "px";
      document.getElementById("context-menu").style.left = event.clientX + "px";
      document.getElementById("context-menu").classList.remove("hidden");
    })

    table.appendChild(newRow);
  });
}

function loadRecords() {
  let monthAsText = document.getElementById("search-by-month-input").value;
  if (monthAsText !== "Всички") {
    window.api.loadRecords(monthAsText).then((data, err) => {
      if (err) {
        console.error(err);
      }
      if (data) {
        clearMemory();
        console.log(data);
        addElements(data);
      }
    });
    return
  }
  window.api.loadRecords().then((data, err) => {
    if (err) {
      console.error(err);
    }
    if (data) {
      clearMemory();
      console.log(data);
      addElements(data);
    }
  });
}

loadRecords();

document.getElementById("button-save").addEventListener("click", () => {
  let monthAsText = document.getElementById("month-input-info").innerHTML;
  let id = document.getElementById("id-input").value;
  let licensePlate = document.getElementById("license-plate-input").value;
  let fullname = document.getElementById("fullname-input").value;
  let dateOfConclusion = document.getElementById("date-of-conclusion-input").value;
  let dateOfExpiration = document.getElementById("date-of-expiration-input").value;
  let numberOfPayments = document.getElementById("payment-input").value;
  let phoneNumber = document.getElementById("pnumber-input").value;
  let discount = document.getElementById("discount-input").value;
  let price = document.getElementById("price-input").value;
  if (id == "") {
    return
  }
  window.moment.format(dateOfConclusion, "YYYY-MM-DD").then((date) => {
    window.api
      .createRecord(monthAsText, id, licensePlate, fullname, date, dateOfExpiration, numberOfPayments, phoneNumber, discount, price)
      .then((res) => {
        // document.getElementById("id-input").value = "";
        // document.getElementById("pnumber-input").value = "";
        // document.getElementById("discount-input").value = "Няма";
        console.log(res);
        loadRecords();
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

document.getElementById("button-update").addEventListener("click", () => {
  let monthAsText = document.getElementById("month-input-info").innerHTML;
  let id = document.getElementById("id-input").value;
  let licensePlate = document.getElementById("license-plate-input").value;
  let fullname = document.getElementById("fullname-input").value;
  let dateOfConclusion = document.getElementById("date-of-conclusion-input").value;
  let dateOfExpiration = document.getElementById("date-of-expiration-input").value;
  let numberOfPayments = document.getElementById("payment-input").value;
  let phoneNumber = document.getElementById("pnumber-input").value;
  let discount = document.getElementById("discount-input").value;
  let price = document.getElementById("price-input").value;
  if (id == "") {
    return
  }
  window.moment.format(dateOfConclusion, "YYYY-MM-DD").then((date) => {
    window.api
      .updateRecord(monthAsText, licensePlate, fullname, date, dateOfExpiration, numberOfPayments, phoneNumber, discount, price, id)
      .then((res) => {
        // document.getElementById("id-input").value = "";
        // document.getElementById("pnumber-input").value = "";
        // document.getElementById("discount-input").value = "Няма";
        console.log(res);
        loadRecords();
      })
      .catch((err) => {
        console.error(err);
      });
  });
});

// document
//   .getElementById("button-search-by-policy")
//   .addEventListener("click", () => {
//     let id = document.getElementById("id-input").value;

//     if (id == "") {
//       loadRecords();
//       return;
//     }
//     window.api
//       .searchRecordByPolicy(id)
//       .then((res) => {
//         clearMemory();

//         addElements(res);
//         console.log(res);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   });

document
  .getElementById("button-search-by-license-plate")
  .addEventListener("click", () => {
    let lPlate = document.getElementById("license-plate-input").value;

    if (lPlate == "") {
      loadRecords();
      return;
    }
    window.api
      .searchRecordByLicensePlate(lPlate)
      .then((res) => {
        clearMemory();

        addElements(res);
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  });

// document
//   .getElementById("button-search-by-date")
//   .addEventListener("click", () => {
//     let date = document.getElementById("date-input").value;

//     window.api
//       .searchRecordByDate(date)
//       .then((res) => {
//         clearMemory();

//         addElements(res);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   });

// document
//   .getElementById("button-delete")
//   .addEventListener("click", () => {
//     let id = document.getElementById("id-input").value;
    
//     if (id == "") {
//       return;
//     }

//     window.api
//       .deleteRecord(id)
//       .then((res) => {
//         clearMemory();

//         loadRecords();
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   });

// document.getElementById("discount-input").addEventListener("focus", (e) => {
//   e.target.select();
// });
