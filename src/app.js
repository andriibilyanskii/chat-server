'use strict';

const express = require('express');
const { Server } = require('ws');
const path = require('path');
const Ably = require('ably/promises');

const { authRouter } = require('./express/router/auth');

const PORT = 3000;

const app = express();


app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(__dirname + 'public/static'));
app.use('/api', authRouter);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));


async function publishSubscribe() {

  // Connect to Ably with your API key
  const ably = new Ably.Realtime.Promise("cc6thQ.GaMm8w:rHG21ntho-AWdF_fmCW6CGD6bELldxtbXM-V_QNc1Bk")
  ably.connection.once("connected", () => {
    console.log("Connected to Ably!")
  })

  // Create a channel called 'get-started' and register a listener to subscribe to all messages with the name 'first'
  const channel = ably.channels.get("get-started")
  await channel.subscribe("first", (message) => {
    console.log("Message received: " + message.data)
  });

  // Publish a message with the name 'first' and the contents 'Here is my first message!'
  await channel.publish("first", "Here is my first message!")

  // Close the connection to Ably after a 5 second delay
  // setTimeout(async () => {
  //   ably.connection.close();
  //     await ably.connection.once("closed", function () {
  //       console.log("Closed the connection to Ably.")
  //     });
  // }, 5000);
}

publishSubscribe();