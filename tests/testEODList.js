#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const EODReminderPath = path.join(__dirname, "../config-files/EODReminderTimes.json");
const sleepyRAPath = path.join(__dirname, '../config-files/sleepyRAs.txt');
var sleepyRANames = fs.readFileSync(sleepyRAPath).toString().split('\n');
const EODPath = path.join(__dirname, "../config-files/eods.json");
var EODs = JSON.parse(fs.readFileSync(EODPath));

var EODJSON;


var EODContent = fs.readFileSync(EODReminderPath);

EODJSON = JSON.parse(EODContent);

//console.log(EODJSON);

// Saves an EOD reminder
var addEODReminder = (name, message) => {
    var messageArr = message.split(";");
    var reminderJSON = JSON.parse('{ "time": ' + '"' + messageArr[0]
    + '", ' + '"weekday": [' +  messageArr[1].split(",")
    + '], "message": ' +  messageArr[2] + "}");
    //console.log(reminderJSON)
    if (EODJSON[name] !== undefined){
        //console.log(EODJSON[name]["reminders"]);
        EODJSON[name]["reminders"].push(reminderJSON)
    } else {
        //console.log(name + " not found.");
        EODJSON[name] = {"reminders" : [reminderJSON]}
    }
    fs.writeFileSync(EODReminderPath, JSON.stringify(EODJSON), 'utf8');
    return JSON.stringify(reminderJSON);
}

// Returns EOD reminders in JSON format
var viewEODReminders = (name) => {
    if (EODJSON[name] !== undefined){
        return EODJSON[name]["reminders"];
    } else {
        return ("Sorry " + name + ", but you have no EOD Reminders.");
    }
}

var getNumEODs = (name) => {
    if (EODJSON[name] !== undefined) {
        return EODJSON[name]["reminders"].length;
    }
    return 0;
}

// Removes an EOD reminder
var removeEODReminder = (name, number) => { //module.exports.
    if (EODJSON[name] !== undefined){
        var removedReminder = EODJSON[name]["reminders"].splice(number, 1);
        fs.writeFileSync(EODReminderPath, JSON.stringify(EODJSON), 'utf8');
        return JSON.stringify(removedReminder[0]);
    }
}

var submitEOD  = (name, data) => {
	EODs[name] = data;
	sleepyRANames = sleepyRANames.filter(n => n!== name);
	fs.writeFileSync(EODPath, JSON.stringify(EODs), 'utf8');
	fs.writeFileSync(sleepyRAPath, sleepyRANames.join('\n') + "\n", 'utf8');
}

var getSleepyRAs  = () => {
    return sleepyRANames;
}

exports.addEODReminder = addEODReminder;
exports.viewEODReminders = viewEODReminders;
exports.getNumEODs = getNumEODs;
exports.removeEODReminder = removeEODReminder;
exports.submitEOD = submitEOD;
exports.getSleepyRAs = getSleepyRAs;


//addEODReminder("naiuhz", "17:00;1,2,3,4,5;\"It's 5PM, remember to submit EOD! :ayaya:\"");
//addEODReminder("Jason", "10:00;1,2,3,4,5;\"It's 10AM, remember to submit yesterday's EOD! :ayaya:\"");

//console.log(viewEODReminders("naiuhz"));
//console.log(removeEODReminder("naiuhz", 2));

//console.log(EODJSON["naiuhz"]["reminders"]);
//console.log(EODJSON["Jason"]["reminders"]);

//console.log()

//There was an attempt to use the async function: readFile 
/*let readEOD = async function() {
    return new Promise((resolve, reject) => {
        var EODContent = fs.readFile(path.join(__dirname, "../config-files/EODReminderTimes.json"), (err, data) => {
            if (err) {
                reject(data);
            }
            resolve(data);
        });
        EODJSON = JSON.parse(EODContent);
    });
}
await readEOD();*/

//There was a second attempt to use the async function: readFile 
/*
let load = async () => {
    const EODContent = await Promise.all( fs.readFile(path.join(__dirname, "../config-files/EODReminderTimes.json"), { encoding: "utf8", flag: "a+" }));
    try {
        EODJSON = JSON.parse(EODContent);
        var name = "naiuhz"
        if (EODJSON[name] !== undefined){
            console.log(name + " found.");
        } else {
            console.log(name + " not found.");
        }
    } catch (e) {
        console.log(`Error parsing ${this.dataFile}: ${e}`);
    }
}
load();*/
