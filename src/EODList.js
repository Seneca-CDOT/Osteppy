
const path = require("path");
const fs = require("fs");

class EODList {
  constructor({
    dataFile = path.join(__dirname, "../config-files/eods.json"),
    unsubmittedNamesFile = path.join(__dirname, "../config-files/sleepyRAs.txt"),
    EODReminderTimes = path.join(__dirname, "../config-files/EODReminderTimes.json")
  } = {}) {
    this.reportData = {};
    this.dataFile = dataFile;
    this.unsubmittedNames = [];
    this.unsubmittedNamesFile = unsubmittedNamesFile;
    this.EODReminderTimes = EODReminderTimes;
  }

  async load() {
    const results = await Promise.all([
      fs.readFile(this.dataFile, { encoding: "utf8", flag: "a+" }),
      fs.readFile(this.unsubmittedNamesFile, {
        encoding: "utf8",
        flag: "a+"
      }),
      fs.readFile(this.EODReminderTimes, {
        encoding: "utf8",
        flag: "a+"
      })
    ]);
    const [reportData, unsubmittedNames] = results;

    try {
      this.reportData = JSON.parse(reportData);
    } catch (e) {
      console.log(`Error parsing ${this.dataFile}: ${e}`);
    }

    this.unsubmittedNames = unsubmittedNames.split("\n");
  }

  save() {
    return Promise.all([
      fs.writeFile(this.dataFile, JSON.stringify(this.reportData)),
      fs.writeFile(this.unsubmittedNamesFile, this.unsubmittedNames.join("\n"))
    ]);
  }

  submit(name, data) {
    this.reportData[name] = data;
    this.unsubmittedNames = this.unsubmittedNames.filter(n => n !== name);
    return this.save();
  }

  missing() {
    return this.unsubmittedNames;
  }

  report() {
    return this.reportData;
  }

  //Adds or overwrites an EOD reminder
  //Given: name, reminder formatted as TIME WEEKDAYS MESSAGE
  add(name, reminder) {
    console.log(this.EODReminderTimes);
    if (this.EODReminderTimes[name] !== undefined){
      console.log(name + " found.");
    } else {
      console.log(name + " not found.");
    }
    const reminders = this.EODReminderTimes[name];
  }
}

module.exports = EODList;