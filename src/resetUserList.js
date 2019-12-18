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
    // If today is a weekday other than Friday, reset the user list tomorrow at 10AM
    if (today.getDay() >= 1 &&  today.getDay() <= 4){
        return calculateNextWeekday(1); 
    } else if (today.getDay() == 5) { //If today is Friday, reset the user list next Monday
        return calculateNextWeekday(3);
    }
}

const calculateNextWeekday = (nextWeekday) => {
    const restartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + nextWeekday, resetHour, 0, 0);
    return restartDate - today;
}

setTimeout(() => resetRAList(), findNextWeekday());