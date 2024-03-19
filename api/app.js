'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');

const { WebSocketServer } = require('ws');
const http = require('http');
const uuidv4 = require('uuid').v4;
const url = require('url');

const authRouter = require('../src/express/router/auth');
const testRouter = require('../src/express/router/test');

const PORT = 8080;

require('dotenv').config();
// const runMongo = require('../src/db/mongoose');
// runMongo();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use(cors());
app.options('*', cors());

const server = http.createServer(app);
const { Server } = require('socket.io');
const socketIO = new Server(server, {
	cors: {
		origin: '*',
	},
});

let users = [];

socketIO.on('connection', (socket) => {
	console.log(`${socket.id} user just connected!`);
	socket.on('message', (data) => {
		console.log(data)
		socketIO.emit('messageResponse', data);
	});

	socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

	socket.on('newUser', (data) => {
		users.push(data);
		socketIO.emit('newUserResponse', users);

		console.log(data);
	});

	socket.on('disconnect', () => {
		console.log('A user disconnected');
		users = users.filter((user) => user.socketID !== socket.id);
		socketIO.emit('newUserResponse', users);
		socket.disconnect();
	});
});

app.use((req, res, next) => {
	console.log(req.body);

	// res.setHeader('Access-Control-Allow-Origin', '*');
	// res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
	// res.setHeader(
	// 	'Access-Control-Allow-Headers',
	// 	'Content-Type, Authorization, Content-Length, X-Requested-With'
	// );
	// if (req.originalUrl.includes('/api')) {
	// 	res.setHeader('Content-Type', 'application/json');
	// }

	next();
});

app.use(express.static(path.join(__dirname, '../public')));
app.use('/static', express.static(__dirname + '../public/static'));

app.use('/api', authRouter);
app.use('/api', testRouter);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
