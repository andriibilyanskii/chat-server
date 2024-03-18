'use strict';

const express = require('express');
const path = require('path');
const Ably = require('ably/promises');
const cors = require('cors');

const { WebSocketServer } = require('ws');
const http = require('http');
const uuidv4 = require('uuid').v4;
const url = require('url');

const authRouter = require('./src/express/router/auth');

const PORT = 3000;

require('dotenv').config();
const runMongo = require('./src/db/mongoose');
runMongo();

const app = express();

const server = http.createServer(app);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

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

const wsServer = new WebSocketServer({ server });

const connections = {};
const users = {};

const handleMessage = (bytes, uuid) => {
	const message = JSON.parse(bytes.toString());

	console.log(message);
	const user = users[uuid];
	user.state = message;
	broadcast(uuid);
};

const handleClose = (uuid) => {
	delete connections[uuid];
	delete users[uuid];
	broadcast();
};

const broadcast = (uuidMe) => {
	Object.keys(connections).forEach((uuid) => {
		if (uuidMe !== uuid) {
			const connection = connections[uuid];
			const message = JSON.stringify(users);
			connection.send(message);
		}
	});
};

wsServer.on('connection', (connection, request) => {
	const { username } = url.parse(request.url, true).query;
	const uuid = uuidv4();
	console.log(`${uuid} connected`);
	connections[uuid] = connection;
	users[uuid] = {
		username,
		state: {},
	};
	connection.on('message', (message) => handleMessage(message, uuid));
	connection.on('close', () => handleClose(uuid));
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

// async function publishSubscribe() {
//   const ably = new Ably.Realtime.Promise("cc6thQ.GaMm8w:rHG21ntho-AWdF_fmCW6CGD6bELldxtbXM-V_QNc1Bk")
//   ably.connection.once("connected", () => {
//     console.log("Connected to Ably!")
//   })

//   const channel = ably.channels.get("get-started")
//   await channel.subscribe("first", (message) => {
//     console.log("Message received: " + message.data)
//   });

//   await channel.publish("first", "Here is my first message!")

//   // Close the connection to Ably after a 5 second delay
//   // setTimeout(async () => {
//   //   ably.connection.close();
//   //     await ably.connection.once("closed", function () {
//   //       console.log("Closed the connection to Ably.")
//   //     });
//   // }, 5000);
// }

// publishSubscribe();
