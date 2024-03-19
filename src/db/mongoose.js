const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = 'mongodb+srv://andriibilyanskii:tTDABgQCJQlQyyMV@chat.ws57ca8.mongodb.net/';

async function runMongo() {
	await mongoose.connect(MONGO_URL);
}

module.exports = runMongo;
