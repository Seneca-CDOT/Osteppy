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

const { WebClient } = require('@slack/web-api'); //const { WebClient } = require('@slack/client');
const slackToken = fs.readFileSync(path.resolve(__dirname, '../config-files/SLACK_TOKEN'), 'utf8');
const web = new WebClient(slackToken);
const channelIDs = require(path.join(__dirname, '../config-files/channelID.json'));
const eodReminders = require(path.join(__dirname, '../config-files/EODReminderTimes.json'));
const sleepyRANames = fs.readFileSync(path.resolve(__dirname, '../config-files/sleepyRAs.txt')).toString().split('\n');
const today = new Date();

const Holidays = require('date-holidays');
const country = 'CA';
const hd = new Holidays(country);
const currentYear = today.getFullYear();
const nationalHolidays = hd.getHolidays(currentYear);
var holidayJSON = [];

// Local function used to send EOD reminders
const sendEODs = (reminders) => {
    for (var i = 0; i < reminders.length; i++){
        const reminder = reminders[i];
        web.chat.postMessage({ channel: channelIDs[reminder[0]], text: reminder[1] });
    }
}

//Formats date to YYYY-MM-DD
const YYYYMMDDFormatter = (date) => {
	return `${date.getFullYear()}-${("0" + parseInt(date.getMonth() + 1)).slice(-2)}-${date.getDate()}`;
}

//Gets the nth next day
const getNthNextDay = (d, n) => {
	let newDate = new Date (d.getTime());
	newDate.setDate(newDate.getDate() + n);
	return (newDate);
}

//Credits to Michael Laszlo for his nthWeekdayOfMonth function
//Source code: https://stackoverflow.com/a/32193378
const nthWeekdayOfMonth = (weekday, n, date) => {
    var count = 0,
        idate = new Date(date.getFullYear(), date.getMonth(), 1);
    while (true) {
      if (idate.getDay() === weekday) {
        if (++count == n) {
          break;
        }
      }
      idate.setDate(idate.getDate() + 1);
    }
    return idate;
}

//Writes the holidays to holidays.json
const findHolidays = () => {
    nationalHolidays.forEach(holiday => {
        const holidayMonth = new Date(holiday.date).getMonth();
        if (holiday.type === 'public' && holidayMonth !== 0 && holidayMonth !== 11 && holiday.name != 'Remembrance Day' && holiday.name != 'Easter Sunday') {
			holidayJSON.push(holiday.date.slice(0,10));
        }
    });

    // Add family day to the list of holidays
    const familyDayDate = YYYYMMDDFormatter(nthWeekdayOfMonth(1, 3, new Date(currentYear, 1)));
	holidayJSON.push(familyDayDate);
	const firstWinterHolidayDate = nthWeekdayOfMonth(1, 4, new Date(currentYear, 11));
    const lastWinterHolidayDateThisYear = nthWeekdayOfMonth(5, 1, new Date(currentYear, 0));
    const lastWinterHolidayDateNextYear = nthWeekdayOfMonth(5, 1, new Date(currentYear + 1, 0));
    
    // Add the winter holidays to list of holidays: 4th Monday of December to 1st Friday of January
    for (let i = 0; i <= 4; i ++){
		//4th week of December in current year
		holidayJSON.push(YYYYMMDDFormatter(getNthNextDay(firstWinterHolidayDate, i)));
		//1st week of January in current year
		holidayJSON.push(YYYYMMDDFormatter(getNthNextDay(lastWinterHolidayDateThisYear, i-4)));
		//1st week of January in next year
		holidayJSON.push(YYYYMMDDFormatter(getNthNextDay(lastWinterHolidayDateNextYear, i-4)));
    }
    //console.log(holidayJSON);
}

const checkHoliday = () => {
    if (holidayJSON.includes(new Date().toISOString().slice(0, 10))) {      
        return true;
    }
    return false;
}

// Sends the next successive EOD reminders
const sendNextReminders = () => {
    findHolidays();
    if (!checkHoliday()) {
        let nextReminderSeconds = 604800000;
        let nextReminderTime = [];
        let nextReminders = [];
        sleepyRANames.forEach((name) => {
            if (eodReminders[name] !== undefined){
                const reminderArr = eodReminders[name]["reminders"];
                for (var i = 0; i < reminderArr.length; i++){
                    const reminder = reminderArr[i];
                    if (reminder["weekday"].includes(today.getDay())){
                        const reminderTime = reminder["time"].split(":");
                        const reminderDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), reminderTime[0], reminderTime[1], 0);
                        const reminderDiff = reminderDate - today;
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
            if (eodReminders[name] !== undefined){
            const reminderArr = eodReminders[name]["reminders"];
                for (var i = 0; i < reminderArr.length; i++){
                    const reminder = reminderArr[i];
                    const reminderTime = reminder["time"].split(":");
                    if (reminder["weekday"].includes(today.getDay()) && reminderTime[0] === nextReminderTime[0] && reminderTime[1] === nextReminderTime[1]){
                        nextReminders.push([name, reminder["message"]]);
                    }
                }
            }
        });
        const hours = parseInt(nextReminderSeconds/3600000);
        console.log("DEBUG: Today is a workday, sleeping for " + hours + " hour(s) and " + parseInt((nextReminderSeconds/60000)-hours*60) + " minute(s).");
        setTimeout(() => sendEODs(nextReminders), nextReminderSeconds);
    } else {
        const timeTillTomorrow = new Date(today.getFullYear(),  today.getMonth(), today.getDate()+1) - today;
        const hours = parseInt(timeTillTomorrow/3600000);
        console.log("DEBUG: Today is a holiday, sleeping for " + hours + " hour(s) and " + parseInt((timeTillTomorrow/60000)-hours*60) + " minute(s).");
        setTimeout(() => {}, timeTillTomorrow);
    }
}

sendNextReminders();
