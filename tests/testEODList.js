#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
var EODJSON;

/*
const EODList = require('./EODList');

const EOD = new EODList();

//EOD.load().catch(console.log);
EOD.loadEOD().catch(console.log);*/




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

var EODContent = fs.readFileSync(path.join(__dirname, "../config-files/EODReminderTimes.json"));

EODJSON = JSON.parse(EODContent);


//console.log(EODJSON);


var addEODReminder = (name, message) => {
    var messageArr = message.split(";")
    var reminderJSON = JSON.parse('{ "time": ' + '"' + messageArr[0] 
    + '", ' + '"weekday": [' +  messageArr[1].split(",")
    + '], "message": ' +  messageArr[2] + "}");
    //console.log(reminderJSON)
    if (EODJSON[name] !== undefined){
        //console.log(EODJSON[name]["reminders"]);
        EODJSON[name]["reminders"].push(reminderJSON)
    } else {
        console.log(name + " not found.");
        EODJSON[name] = {"reminders" : [JSON.parse('{ "time": ' + '"' + messageArr[0] 
        + '", ' + '"weekday": [' +  messageArr[1].split(",")
        + '], "message": ' +  messageArr[2] + "}")]}
    }
}

addEODReminder("naiuhz", "17:00;1,2,3,4,5;\"It's 5PM, remember to submit EOD! :ayaya:\"");
addEODReminder("Jason", "10:00;1,2,3,4,5;\"It's 10AM, remember to submit yesterday's EOD! :ayaya:\"");

console.log(EODJSON["naiuhz"]["reminders"]);
console.log(EODJSON["Jason"]["reminders"]);

//console.log()