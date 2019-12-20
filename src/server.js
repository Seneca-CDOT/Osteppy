#!/usr/bin/env node

//import axios from 'axios';
//import express from 'express';
//import http from 'http';
//import EODList from './EODList';
//import bodyParser from 'body-parser';

const axios = require("axios");
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
//const EODList = require('./EODList');
const bodyParser = require('body-parser');
const EOD = require('./EODList');
const today = new Date();

const app = express();

app.server = http.createServer(app);

app.use(bodyParser.urlencoded({
    extended: true,
}));

// Slash command for setting EOD Reminder channel
// ${slackRequest.channel_id}


// Slash command for submitting EOD's
app.post('/eod', (req, res) => {
	const slackRequest = req.body;
	const emojiIndex = slackRequest.text.indexOf(":");
	let emoji = "checkered_flag";
	let message = slackRequest.text;
  	if (emojiIndex == 0 || emojiIndex == 1) {
		const emojiEndIndex = slackRequest.text.indexOf(":", emojiIndex + 1);
		if (emojiEndIndex != -1){
			emoji = slackRequest.text.substring(emojiIndex + 1, emojiEndIndex);
			message = message.substring (emojiEndIndex + 1);
		}
	}
	if (today.getHours() < 10) {
		today.setDate(today.getDate()-1);
	}
	const slackResponse = {
	response_type: 'in_channel',
	text: `:${emoji}: EOD was submitted by *${slackRequest.user_name}* on ${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()}`,
	attachments: [
		{
		text: `${message}`,
		},
	],
	};
	axios
	.post(slackRequest.response_url, slackResponse)
	.then(() => EOD.submitEOD(slackRequest.user_name, {
		time: new Date(),
		text: slackRequest.text,
		channel: slackRequest.channel_name,
	}))
	res.status(200).send();
});

// Slash command for checking who have yet to submit EOD's
app.post('/eods_left', (req, res) => {
	const slackRequest = req.body;
  
	const message = EOD.getSleepyRAs().join('\n');
	const slackResponse = {
	  response_type: 'in_channel',
	  text: 'Sleepy RAs who haven\'t submitted their EODs:',
	  attachments: [
		{
		  text: `${message}`,
		},
	  ],
	};
	axios
	  .post(slackRequest.response_url, slackResponse)
	  .catch((error) => {
		console.log(`error: ${error}`);
	  });
  
	res.status(200).send();
});

// Slash command for adding an EOD
app.post('/add_eod_reminder', (req, res) => {
	const slackRequest = req.body;
	
	if (slackRequest.text.split(";").length == 3){
		const message = EOD.addEODReminder(slackRequest.user_name,slackRequest.text);
		const slackResponse = {
		response_type: 'in_channel',
		text: `EOD added:`,
		attachments: [
			{
			text: `${message}`,
			},
		],
		};
		axios
		.post(slackRequest.response_url, slackResponse)
		res.status(200).send();
	} else {
		//console.log("add_eod_reminder failed: " + slackRequest.text.split(";").length)
		const slackResponse = {
		response_type: 'in_channel',
		text: `ERROR: Wrong syntax used. Correct syntax: time;weekdays;"message"`,
		attachments: [
			{
			text: `Eg. 17:00;1,2,3,4,5;"It's 5PM, remember to submit EOD! :robot_face:"\n Your message: ${slackRequest.text}`,
			},
		],
		};
		axios
		.post(slackRequest.response_url, slackResponse)
		res.status(200).send();
	}
});

// Slash command for checking EOD reminders
app.post('/check_eod_reminders', (req, res) => {
	const slackRequest = req.body;
  
	const EODs = EOD.viewEODReminders(slackRequest.user_name);
	var message = "";

	for (let i = 0; i < EODs.length; i++){
		message += i + ": " + JSON.stringify(EODs[i]) + "\n";
	}

	const slackResponse = {
	  response_type: 'in_channel',
	  text: 'Your EODs:',
	  attachments: [
		{
		  text: `${message}`,
		},
	  ],
	};
	axios
	  .post(slackRequest.response_url, slackResponse)
	  .catch((error) => {
		console.log(`error: ${error}`);
	  });
  
	res.status(200).send();
});

// Slash command for removing an EOD
app.post('/remove_eod_reminder', (req, res) => {
	const slackRequest = req.body;
	const numEODs = EOD.getNumEODs(slackRequest.user_name);
	const removeIndex = parseInt(slackRequest.text);
	if (numEODs > 0 && !isNaN(removeIndex) && removeIndex < numEODs){
		const message = EOD.removeEODReminder(slackRequest.user_name, slackRequest.text);
		const slackResponse = {
		response_type: 'in_channel',
		text: `EOD removed:`,
		attachments: [
			{
			text: `${message}`,
			},
		],
		};
		axios
		.post(slackRequest.response_url, slackResponse)
		res.status(200).send();
	} else {
		var message = "";
		if (numEODs == 0) {
			message =  "Sorry " + slackRequest.user_name + ", but you have no EOD Reminders to remove."
		} else {
			message = "Sorry " + slackRequest.user_name + ", but you only have " + numEODs + " EOD Reminders and your index: " + slackRequest.text + " is out of bounds or invalid.";

		}
		const slackResponse = {
			response_type: 'in_channel',
			text: message
			};
			axios
			.post(slackRequest.response_url, slackResponse)
			res.status(200).send();
	}
});

// Slash command for adding an EOD
app.post('/set_vacation', (req, res) => {
	
	const slackRequest = req.body;
	if (slackRequest.text.indexOf("remove") != -1){
		//Add vacation day(s)
		const message = EOD.setVactionDates(slackRequest.user_name,slackRequest.text);
		const slackResponse = {
		response_type: 'in_channel',
		text: `Vacation date(s) added:`,
		attachments: [
			{
			text: `${message}`,
			},
		],
		};
		axios
		.post(slackRequest.response_url, slackResponse)
		res.status(200).send();
	} else {
		//Remove vacation date(s)
		const message = EOD.setVactionDates(slackRequest.user_name,slackRequest.text);
		const slackResponse = {
		response_type: 'in_channel',
		text: `Vacation date(s) removed:`,
		attachments: [
			{
			text: `${message}`,
			},
		],
		};
		axios
		.post(slackRequest.response_url, slackResponse)
		res.status(200).send();
	}
});

app.server.listen(8080 || config.port, () => { //process.env.PORT 
    console.log(`Started on port ${app.server.address().port}`);
});



//Tests
//console.log(JSON.stringify(EOD.addEODReminder("naiuhz", "17:00;1,2,3,4,5;\"It's 5PM, remember to submit EOD! :ayaya:\"")));
