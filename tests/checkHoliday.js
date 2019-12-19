#!/usr/bin/env node

var Holidays = require('date-holidays')
const country = 'CA';
var hd = new Holidays(country);




//console.log(hd.getStates(country));

//console.log(hd.getRegions('CA', 'on'));

//console.log(hd.getStates('US'));

//console.log(hd.getRegions('US', 'la'));

console.log(hd.getHolidays(2019));


function nthWeekdayOfMonth(weekday, n, date) {
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

var familyDayDate = nthWeekdayOfMonth(1, 3, new Date(new Date().getFullYear(), 1));

var lastWinterHolidayDate = nthWeekdayOfMonth(5, 1, new Date(new Date().getFullYear(), 0));

console.log (lastWinterHolidayDate);

//console.log (familyDay);

const holidayDatesPath = path.join(__dirname, '../config-files/holidays.txt');
var holidayDates = fs.readFileSync(holidayDatesPath).toString().split('\n');
fs.writeFileSync(holidayDatesPath, holidayDates.join('\n') + "\n", 'utf8');