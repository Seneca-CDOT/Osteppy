#!/usr/bin/env node

const Holidays = require('date-holidays');
const country = 'CA';
const hd = new Holidays(country);
const path = require("path");
const fs = require("fs");
const holidayJSONPath = path.join(__dirname, '../config-files/holidays.json');
const currentYear = new Date().getFullYear();
const nationalHolidays = hd.getHolidays(currentYear);
var holidayJSON = [];

//console.log(nationalHolidays);

//Credits to Michael Laszlo for his nthWeekdayOfMonth function
//Source code: https://stackoverflow.com/a/32193378
nthWeekdayOfMonth = (weekday, n, date) => {
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

writeHolidays = () => {
    nationalHolidays.forEach(holiday => {
        const holidayMonth = new Date(holiday.date).getMonth();
        if (holiday.type === 'public' && holidayMonth !== 0 && holidayMonth !== 11 && holiday.name != 'Remembrance Day' && holiday.name != 'Easter Sunday') {
            //console.log(holiday);
			holidayJSON.push(holiday.date.slice(0,10));
        }
    });

    // Add family day to the list of holidays
    const familyDayDate = nthWeekdayOfMonth(1, 3, new Date(currentYear, 1)).toISOString().slice(0,10);
	  holidayJSON.push(familyDayDate);
	  const firstWinterHolidayDate = nthWeekdayOfMonth(1, 4, new Date(currentYear, 11));
    const lastWinterHolidayDateThisYear = nthWeekdayOfMonth(5, 1, new Date(currentYear, 0));
    const lastWinterHolidayDateNextYear = nthWeekdayOfMonth(5, 1, new Date(currentYear + 1, 0));
    
    // Add the winter holidays to list of holidays: 4th Monday of December to 1st Friday of January
    for (let i = 0; i <= 4; i ++){
		holidayJSON.push((new Date (new Date(firstWinterHolidayDate).getTime() + i * (24 * 60 * 60 * 1000))).toISOString().slice(0,10));
		holidayJSON.push((new Date (new Date(lastWinterHolidayDateThisYear).getTime() + (i-4) * (24 * 60 * 60 * 1000))).toISOString().slice(0,10));
		holidayJSON.push((new Date (new Date(lastWinterHolidayDateNextYear).getTime() + (i-4) * (24 * 60 * 60 * 1000))).toISOString().slice(0,10));
    }
    
	fs.writeFileSync(holidayJSONPath, JSON.stringify(holidayJSON), 'utf8');
}

//writeHolidays();

exports.writeHolidays = writeHolidays;
