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

const cpCommand = 'cp ' + path.join(__dirname, '../config-files/RAs.txt') + " " + path.join(__dirname, '../config-files/sleepyRAs.txt')

resetRAList = () => {
    execSync(cpCommand);
};

const calculateNextWeekday = () => {

}

setTimeout(() => resetRAList(), calculateNextWeekday());