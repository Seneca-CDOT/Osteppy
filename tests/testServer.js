#!/usr/bin/env node

//import axios from 'axios';
//import express from 'express';
//import http from 'http';
//import EODList from './EODList';
//import bodyParser from 'body-parser';
const axios = require("axios");
const express = require('express');
const http = require('http');
const EODList = require('./EODList');
const bodyParser = require('body-parser');
const testEOD = require('./testEODList');

const EOD = new EODList();

const app = express();



app.server = http.createServer(app);


app.use(bodyParser.urlencoded({
    extended: true,
  }));

app.post('/eod', (req, res) => {
    const slackRequest = req.body;

    console.log(slackRequest.text);

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
      .then(() => EOD.submit(slackRequest.user_name, {
        time: new Date(),
        text: slackRequest.text,
        channel: slackRequest.channel_name,
      })).catch((error) => {
        console.log(`error: ${error}`);
      });
  
    res.status(200).send();
  });

app.server.listen(8080 || config.port, () => { //process.env.PORT 
    console.log(`Started on port ${app.server.address().port}`);
});

//console.log(JSON.stringify(testEOD.addEODReminder("naiuhz", "17:00;1,2,3,4,5;\"It's 5PM, remember to submit EOD! :ayaya:\"")));


//export default app;