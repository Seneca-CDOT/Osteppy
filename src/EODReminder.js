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


const fs = require('fs');
const path = require('path');

const { execSync } = require('child_process');
const { WebClient } = require('@slack/client');
const cpCommand = 'cp ../config-files/RAs.txt ../config-files/sleepyRAs.txt';
const slackToken = fs.readFileSync(path.resolve(__dirname, '../config-files/SLACK_TOKEN'), 'utf8');
const web = new WebClient(slackToken);
const channelIDs = require('../config-files/channelID.json');
const EODReminders = require('../config-files/EODReminderTimes.json');
const sleepyRANames = fs.readFileSync(path.resolve(__dirname, '../config-files/sleepyRAs.txt')).toString().split('\n');

var today = new Date();

// Local function used to send EOD reminders
const sendEODs = (reminders) => {
  for (var i = 0; i < reminders.length; i++){
    let reminder = reminders[i];
    web.chat.postMessage({ channel: channelIDs[reminder[0]], text: reminder[1] });
  }
}

// Exported function used in slash command
module.exports.sendDM = (RA, message) => {
  web.chat.postMessage({ channel: channelIDs[RA], text: message });
};

// Resets RA list in the morning of a weekday
const resetRAList = () => {
  execSync(cpCommand);
};

// Sends the next successive EOD reminders
const sendNextReminders = () => {
  let nextReminderSeconds = 604800000000;
  let nextReminderTime = Array(2);
  let nextReminders = [];
  sleepyRANames.forEach((name) => {
    if (EODReminders[name] !== undefined){
      let reminderArr = EODReminders[name]["reminders"];
      for (var i = 0; i < reminderArr.length; i++){
        let reminder = reminderArr[i];
        if (reminder["weekday"].includes(today.getDay())){
          let reminderTime = reminder["time"].split(":");
          let reminderDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), reminderTime[0], reminderTime[1], 0);
          let reminderDiff = reminderDate - today;
          if (reminderDiff > 0 && reminderDiff < nextReminderSeconds) {
            nextReminderSeconds = reminderDiff;
            nextReminderTime[0] = reminderTime[0];
            nextReminderTime[1] = reminderTime[1];
          }
        }
      }
    }
  });

  sleepyRANames.forEach((name) => {
    if (EODReminders[name] !== undefined){
      let reminderArr = EODReminders[name]["reminders"];
      for (var i = 0; i < reminderArr.length; i++){
        let reminder = reminderArr[i];
        let reminderTime = reminder["time"].split(":");
        if (reminder["weekday"].includes(today.getDay()) && reminderTime[0] === nextReminderTime[0] && reminderTime[1] === nextReminderTime[1]){
          nextReminders.push([name, reminder["message"]]);
        }
      }
    }
  });

  //console.log ("DEBUG nextReminders: " + nextReminders);

  setTimeout(function(){sendEODs(nextReminders);}, nextReminderSeconds);

}


sendNextReminders();
