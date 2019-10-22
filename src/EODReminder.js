#!/usr/bin/env node

/** ****************************************************
 * OSTEP Dashboard Osteppy API
 * EODreminder.cpp
 * Date Created: 2019/03/07
 * Author: Yiran Zhu
 * Email: yzhu132@myseneca.ca
 * Description: Slack API sends custom EOD reminders to
 * OSTEP Research Assistants
 **************************************************** */

// Javascript version of remindEOD.py


const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');
DateTime.local().setZone('America/Toronto'); //Set your timezone here

const { execSync } = require('child_process');
const { WebClient } = require('@slack/client');
const cpCommand = 'cp ../config-files/RAs.txt ../config-files/sleepyRAs.txt';
const slackToken = fs.readFileSync(path.resolve(__dirname, '../config-files/SLACK_TOKEN'), 'utf8');
const web = new WebClient(slackToken);
const channelIDs = require('../config-files/channelID.json');
const EODReminders = require('../config-files/EODReminderTimes.json');
const sleepyRANames = fs.readFileSync(path.resolve(__dirname, '../config-files/sleepyRAs.txt')).toString().split('\n');

const clock = DateTime.local();


// Sends EOD message to RA if they haven't already submitted their EOD that work day
const sendEOD = (RA, message) => {
  sleepyRANames.forEach((name) => {
    if (name === RA) {
      web.chat.postMessage({ channel: channelIDs[RA], text: message });
    }
  });
};

//console.log(EODReminders['naiuhz']);
//console.log(sleepyRANames);

// Exported function used in slash command
module.exports.sendDM = (RA, message) => {
  web.chat.postMessage({ channel: channelIDs[RA], text: message });
};


// Resets RA list in the morning of a weekday
const resetRAList = () => {
  execSync(cpCommand);
};


const waitForNextReminder = () => {
  let nextReminderSeconds = 604800;
  sleepyRANames.forEach((name) => {
    let reminderArr = EODReminders[name];
    if (reminderArr !== undefined){
      reminderArr.forEach((reminder) => {
        console.log (reminder);
        console.log ("Current. Weekday:" + clock.weekday + ", " + clock.hour + ":" + clock.minute);
      });
    }
  });

}

// Ticks each second, checks if appropriate time to send EOD and writes the time to text file
function tickTock() {
  const clock = DateTime.local();
  //setTimeout(tickTock, 1000);
}

waitForNextReminder();
//tickTock();
