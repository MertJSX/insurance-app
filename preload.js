const { contextBridge, ipcRenderer } = require("electron");

try {
  contextBridge.exposeInMainWorld("moment", {
    format: (date, format) => ipcRenderer.invoke('moment-format', date, format),
    formatFormatted: (date, realDateFormat, format) => ipcRenderer.invoke('moment-format-formatted', date, realDateFormat, format),
    now: () => ipcRenderer.invoke('moment-now'),
  });

  contextBridge.exposeInMainWorld("api", {

    createRecord: (monthAsText, id, licensePlate, fullname, dateOfConclusion, dateOfExpiration, numberOfPayments, phoneNumber, discount, price) => {
      return ipcRenderer.invoke("createRecord", monthAsText, id, licensePlate, fullname, dateOfConclusion, dateOfExpiration, numberOfPayments, phoneNumber, discount, price);
    },

    updateRecord: (monthAsText, licensePlate, fullname, dateOfConclusion, dateOfExpiration, numberOfPayments, phoneNumber, discount, price, id) => {
      return ipcRenderer.invoke("updateRecord", monthAsText, licensePlate, fullname, dateOfConclusion, dateOfExpiration, numberOfPayments, phoneNumber, discount, price, id);
    },

    searchRecordByPolicy: (id) => {
      return ipcRenderer.invoke("searchRecordByPolicy", id);
    },

    searchRecordByLicensePlate: (lPlate) => {
      return ipcRenderer.invoke("searchRecordByLicensePlate", lPlate);
    },

    searchRecordByDate: (date) => {
      return ipcRenderer.invoke("searchRecordByDate", date);
    },

    deleteRecord: (id) => {
      return ipcRenderer.invoke("deleteRecord", id);
    },

    loadRecords: (monthAsText) => {
      if (monthAsText) {
        return ipcRenderer.invoke("loadRecords", monthAsText);
      } else {
        return ipcRenderer.invoke("loadRecords", null);
      }
    },
    
  });
} catch (err) {
  console.log(err);
}