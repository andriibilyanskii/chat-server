const jwt = require('jsonwebtoken');
const User = require('../../../model/users');
const getJSON = require('../../../utils/getJSON');
const defExport = require('../../../../api/app');

const login = async (req, res) => {
	try {
		// const { username } = req.body;

		// const users = defExport.users;

		// if (!username) {
		// 	throw new Error();
		// }

		// let user = Object.entries(users).find(e => e[1].username === username)

		// console.log('u', user)

		// defExport.socketIO.emit("newUser", { userName, socketID: socket.id })

		// console.log(users)

		// if (!user) {
		// 	// const user_register = new User({
		// 	// 	createdDate: new Date().toISOString(),
		// 	// 	username,
		// 	// });

		// 	// user = getJSON(await user_register?.save());
		// }

		// const token = jwt.sign(
		// 	{
		// 		userID: user._id,
		// 		username: username,
		// 	},
		// 	'secretkey',
		// 	{
		// 		expiresIn: '365d',
		// 	}
		// );

		res.status(200).send({
			token: 'a',
			// ...user,
		});
	} catch (e) {
		res.status(500).send('error');
	}
};

module.exports = login;
