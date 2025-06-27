const { app, BrowserWindow, ipcMain, dialog, Tray, Menu } = require("electron");
const path = require("path");
const moment = require("moment");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS main (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            month_as_text TEXT,
            policy_number TEXT NOT NULL,
            license_plate TEXT NOT NULL,
            fullname TEXT NOT NULL,
            date_of_conclusion TEXT NOT NULL,
            date_of_expiration TEXT NOT NULL,
            number_of_payments TEXT NOT NULL,
            dates_for_payment TEXT NOT NULL,
            phone_number TEXT,
            discount TEXT,
            price TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// require("electron-reload")(__dirname, {
//   electron: path.join(__dirname, "node_modules", ".bin", "electron"),
//   ignored: /node_modules|[\/\\]\./,
// });

let win;

moment.locale("bg");

app.on("ready", () => {
  tray = new Tray(path.join(__dirname, "assets/icon.png"));
  const trayMenu = Menu.buildFromTemplate([
    { label: "Покажи", click: () => win.show() },
    { label: "Излез", click: () => app.quit() },
  ]);
  tray.setToolTip("Insurance App");
  tray.setContextMenu(trayMenu);
});

const createWindow = () => {
  win = new BrowserWindow({
    width: 1410,
    height: 600,
    minWidth: 1280,
    minHeight: 1024,
    icon: path.join(__dirname, "assets/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // win.maximize();

  // win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, "client", "index.html"));
  win.webContents.on("did-finish-load", () => {
    console.log("Page has loaded!");
  });
};

ipcMain.handle("moment-format", (event, date, format) => {
  return moment(date).format(format);
});

ipcMain.handle(
  "moment-format-formatted",
  (event, date, realDateFormat, format) => {
    return moment(date, realDateFormat).format(format);
  }
);

ipcMain.handle("moment-now", (event) => {
  return moment().format();
});

ipcMain.handle(
  "updateRecord",
  (
    event,
    monthAsText,
    licensePlate,
    fullname,
    dateOfConclusion,
    dateOfExpiration,
    numberOfPayments,
    phoneNumber,
    discount,
    price,
    id
  ) => {
    return new Promise((resolve, reject) => {
      let datesForPayment = "-";
      switch (numberOfPayments) {
        case "2":
          let dateForPayment1 = moment(dateOfConclusion);
          dateForPayment1 = dateForPayment1.add(6, "months");
          datesForPayment = moment(dateForPayment1).format("DD.MM.YYYY");
          break;
        case "4":
          let dateForPayment2 = moment(dateOfConclusion);
          let dateForPayment3 = moment(dateOfConclusion);
          let dateForPayment4 = moment(dateOfConclusion);
          dateForPayment2.add(3, "months");
          dateForPayment3.add(6, "months");
          dateForPayment4.add(9, "months");

          datesForPayment = `${dateForPayment2.format(
            "DD.MM.YYYY"
          )} ${dateForPayment3.format("DD.MM.YYYY")} ${dateForPayment4.format(
            "DD.MM.YYYY"
          )}`;
          break;
        default:
          datesForPayment = "-";
          break;
      }
      const updateStmt = db.prepare(`
        UPDATE main SET 
        month_as_text = ?,
          license_plate = ?,
           fullname = ?,
            date_of_conclusion = ?,
             date_of_expiration = ?,
              number_of_payments = ?,
               dates_for_payment = ?,
                phone_number = ?,
                 discount = ?,
                  price = ? WHERE policy_number = ?;
      `);
      updateStmt.run(
        monthAsText,
        licensePlate,
        fullname,
        moment(dateOfConclusion).format("DD.MM.YYYY"),
        moment(dateOfExpiration).format("DD.MM.YYYY"),
        numberOfPayments,
        datesForPayment,
        phoneNumber,
        discount,
        price,
        id,
        function (err) {
          if (err) {
            reject("Error creating record: " + err);
          } else {
            resolve("Record created successfully!");
          }
        }
      );
      updateStmt.finalize();
    });
  }
);

ipcMain.handle(
  "createRecord",
  (
    event,
    monthAsText,
    id,
    licensePlate,
    fullname,
    dateOfConclusion,
    dateOfExpiration,
    numberOfPayments,
    phoneNumber,
    discount,
    price
  ) => {
    return new Promise((resolve, reject) => {
      let datesForPayment = "-";
      switch (numberOfPayments) {
        case "2":
          let dateForPayment1 = moment(dateOfConclusion);
          dateForPayment1 = dateForPayment1.add(6, "months");
          datesForPayment = moment(dateForPayment1).format("DD.MM.YYYY");
          break;
        case "4":
          let dateForPayment2 = moment(dateOfConclusion);
          let dateForPayment3 = moment(dateOfConclusion);
          let dateForPayment4 = moment(dateOfConclusion);
          dateForPayment2.add(3, "months");
          dateForPayment3.add(6, "months");
          dateForPayment4.add(9, "months");

          datesForPayment = `${dateForPayment2.format(
            "DD.MM.YYYY"
          )} ${dateForPayment3.format("DD.MM.YYYY")} ${dateForPayment4.format(
            "DD.MM.YYYY"
          )}`;
          break;
        default:
          datesForPayment = "-";
          break;
      }
      const createStmt = db.prepare(`
            INSERT INTO main (month_as_text, policy_number, license_plate, fullname, date_of_conclusion, date_of_expiration, number_of_payments, dates_for_payment, phone_number, discount, price ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `);
      createStmt.run(
        monthAsText,
        id,
        licensePlate,
        fullname,
        moment(dateOfConclusion).format("DD.MM.YYYY"),
        moment(dateOfExpiration).format("DD.MM.YYYY"),
        numberOfPayments,
        datesForPayment,
        phoneNumber,
        discount,
        price,
        function (err) {
          if (err) {
            reject("Error creating record: " + err);
          } else {
            resolve("Record created successfully!");
          }
        }
      );
      createStmt.finalize();
    });
  }
);

ipcMain.handle("loadRecords", (event, monthAsText) => {
  return new Promise((resolve, reject) => {
    if (monthAsText) {
      db.all(
        `
          SELECT *
           FROM main WHERE month_as_text = ?;`,
        [monthAsText],
        (err, rows) => {
          if (err) {
            reject("Error loading records: " + err);
          } else {
            resolve(rows);
          }
        }
      );
      return;
    }
    db.all(
      `
        SELECT *
         FROM main ORDER BY 
         CASE month_as_text
        WHEN 'Януари' THEN 1
        WHEN 'Февруари' THEN 2
        WHEN 'Март' THEN 3
        WHEN 'Април' THEN 4
        WHEN 'Май' THEN 5
        WHEN 'Юни' THEN 6
        WHEN 'Юли' THEN 7
        WHEN 'Август' THEN 8
        WHEN 'Септември' THEN 9
        WHEN 'Октомври' THEN 10
        WHEN 'Ноември' THEN 11
        WHEN 'Декември' THEN 12
        END LIMIT 100;`,
      [],
      (err, rows) => {
        if (err) {
          reject("Error loading records: " + err);
        } else {
          resolve(rows);
        }
      }
    );
  });
});

ipcMain.handle("searchRecordByPolicy", (event, id) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM main WHERE policy_number = ?;`, [id], (err, rows) => {
      if (err) {
        reject("Error loading records: " + err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("searchRecordByLicensePlate", (event, lPlate) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM main WHERE license_plate = ?;`, [lPlate], (err, rows) => {
      if (err) {
        reject("Error loading records: " + err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("searchRecordByDate", (event, date) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM main WHERE date = ?;`,
      [moment(date).format("DD.MM.YYYY")],
      (err, rows) => {
        if (err) {
          reject("Error loading records: " + err);
        } else {
          resolve(rows);
        }
      }
    );
  });
});

ipcMain.handle("deleteRecord", (event, id) => {
  return new Promise((resolve, reject) => {
    dialog
      .showMessageBox(win, {
        type: "question",
        buttons: ["Да", "Не"],
        defaultId: 0,
        title: "Валидиране",
        message: `Сигурни ли сте да изтривате запис ${id} ?`,
      })
      .then((result) => {
        console.log(result);
        
        if (result.response === 0) {
          db.all(`DELETE FROM main WHERE policy_number = ?;`, [id], (err, rows) => {
            if (err) {
              reject("Error loading records: " + err);
            } else {
              resolve(rows);
            }
          });
        }
      });
  });
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    db.close();
    app.quit();
  }
});
