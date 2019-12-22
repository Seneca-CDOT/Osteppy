#!/usr/bin/env node

/******************************************************
 * OSTEP Osteppy API
 * resetUserList.js
 * Date Created: 2019/12/16
 * Author: Yiran Zhu
 * Email: yzhu132@myseneca.ca
 * Description: Resets user list at a specific time 
 * of the day
 *****************************************************/

const path = require('path');
const { execSync } = require('child_process');

const cpCommand = 'cp ' + path.join(__dirname, '../config-files/RAs.txt') + " " + path.join(__dirname, '../config-files/sleepyRAs.txt')
const today = new Date();
const resetHour = 10;

resetRAList = () => {
    execSync(cpCommand);
};

const findNextWeekday = () => {
    // If today is a weekday (other than Friday) or Subday, reset the user list tomorrow at 10AM
    if (today.getDay() <= 4){
        return calculateNextWeekday(1); 
    //If today is Friday or Saturday, reset the user list next Monday
    } else { 
        return calculateNextWeekday(8 - today.getDay());
    } 
}

const calculateNextWeekday = (nextWeekday) => {
    const restartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + nextWeekday, resetHour, 0, 0);
    restartMiliseconds = restartDate - today;
    restartHours = parseInt(restartMiliseconds/3600000);
    restartDays = parseInt(restartHours/24);
    console.log (`DEBUG: Restarting in ${restartDays} day(s) and ${parseInt(restartHours - restartDays*24)} hour(s) and ${parseInt((restartMiliseconds/60000)-restartHours*60)} minute(s)`);
    return restartMiliseconds;
}

setTimeout(() => resetRAList(), findNextWeekday());