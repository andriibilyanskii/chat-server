'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');

const { WebSocketServer } = require('ws');
const http = require('http');
const uuidv4 = require('uuid').v4;
const url = require('url');

const authRouter = require('./src/express/router/auth');
const testRouter = require('./src/express/router/test');

const PORT = 8080;

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
app.use('/api', testRouter)

const wsServer = new WebSocketServer({ server });

const connections = {};
const users = {};

const handleMessage = (bytes, uuid, _id) => {
	const message = JSON.parse(bytes.toString());

	console.log(message);

	const user = users[_id];
	user.state = message;
	broadcast(uuid);
};

const handleClose = (_id, uuid) => {
	delete connections[uuid];
	delete users[_id];
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
	const { _id } = url.parse(request.url, true).query;

	const uuid = uuidv4();

	console.log(`${_id} | ${uuid} connected`);

	connections[uuid] = connection;
	users[_id] = {
		_id,
		state: {},
	};
	connection.on('message', (message) => handleMessage(message, uuid, _id));
	connection.on('close', () => handleClose(_id, uuid));
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));