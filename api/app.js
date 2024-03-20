'use strict';

const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');

const authRouter = require('../src/express/router/auth');
const messagesRouter = require('../src/express/router/messages');
const testRouter = require('../src/express/router/test');

const PORT = 8080;

require('dotenv').config();

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
let messages = [];

socketIO.on('connection', (socket) => {
	console.log(`${socket.id} user connected!`);

	socketIO.emit('onConnect', users);

	socket.on('message', (data) => {
		messages.push(data);
		socketIO.emit('messageResponse', data);
	});

	socket.on('newUser', (data) => {
		if (users?.find((e) => e?.username === data?.username)) {
			users = users.map((user) => {
				if (user.username !== data?.username) {
					return user;
				} else {
					return { ...data, isOnline: true };
				}
			});
		} else {
			users.push({ ...data, isOnline: true });
		}

		socketIO.emit('newUserResponse', users);
	});

	socket.on('disconnect', () => {
		console.log(`${socket.id} disconnected`);

		users = users.map((user) => {
			if (user.socketID !== socket.id) {
				return user;
			} else {
				return { ...user, isOnline: false };
			}
		});

		socketIO.emit('newUserResponse', users);
		socket.disconnect();
	});
});

module.exports.messages = messages;

app.use((req, res, next) => {
	if (req.method !== 'GET') {
		console.log(req.body);
	}

	next();
});

app.use(express.static(path.join(__dirname, '../public')));
app.use('/static', express.static(__dirname + '../public/static'));

app.use('/api', authRouter);
app.use('/api', messagesRouter);
app.use('/api', testRouter);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
