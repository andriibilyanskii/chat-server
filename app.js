'use strict';

const express = require('express');
const path = require('path');
const Ably = require('ably/promises');
const cors = require('cors');

const authRouter = require('./src/express/router/auth');

const PORT = 3000;


require('dotenv').config();
const runMongo = require('./src/db/mongoose');
runMongo();


const app = express();

app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use((req, res, next) => {
  console.log(req.body);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );
  if (req.originalUrl.includes('/api')) {
    res.setHeader('Content-Type', 'application/json');
  }

  next();
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(__dirname + 'public/static'));
app.use('/api', authRouter);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));


async function publishSubscribe() {
  const ably = new Ably.Realtime.Promise("cc6thQ.GaMm8w:rHG21ntho-AWdF_fmCW6CGD6bELldxtbXM-V_QNc1Bk")
  ably.connection.once("connected", () => {
    console.log("Connected to Ably!")
  })

  const channel = ably.channels.get("get-started")
  await channel.subscribe("first", (message) => {
    console.log("Message received: " + message.data)
  });

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