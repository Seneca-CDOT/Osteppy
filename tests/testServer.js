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
const testEOD = require('./testEODList');
const EODReminder = require('./EODReminder');

//const EOD = new EODList();

const app = express();

app.server = http.createServer(app);

app.use(bodyParser.urlencoded({
    extended: true,
  }));

// Slash command for submitting EOD's
app.post('/eod', (req, res) => {
	const slackRequest = req.body;

	const slackResponse = {
	response_type: 'in_channel',
	text: `:checkered_flag: EOD was submitted by *${slackRequest.user_name}*`,
	attachments: [
		{
		text: `${slackRequest.text}`,
		},
	],
	};
	axios
	.post(slackRequest.response_url, slackResponse)
	.then(() => testEOD.submitEOD(slackRequest.user_name, {
		time: new Date(),
		text: slackRequest.text,
		channel: slackRequest.channel_name,
	}))
	res.status(200).send();
});

// Slash command for checking who have yet to submit EOD's
app.post('/eod_left', (req, res) => {
	const slackRequest = req.body;
  
	const message = testEOD.getSleepyRAs().join('\n');
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
		const message = testEOD.addEODReminder(slackRequest.user_name,slackRequest.text);
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

app.server.listen(8080 || config.port, () => { //process.env.PORT 
    console.log(`Started on port ${app.server.address().port}`);
});

//EODReminder.resetRAList();

//console.log(JSON.stringify(testEOD.addEODReminder("naiuhz", "17:00;1,2,3,4,5;\"It's 5PM, remember to submit EOD! :ayaya:\"")));


//export default app;