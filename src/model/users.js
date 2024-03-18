const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		require: true,
		trim: true,
	},
	createdDate: {
		type: String,
		require: true,
		trim: true,
	},
});

const User = mongoose.model('user', userSchema);

module.exports = User;
