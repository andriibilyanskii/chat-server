const jwt = require('jsonwebtoken');
const User = require('../../../model/users');
const getJSON = require('../../../utils/getJSON');

const login = async (req, res) => {
	try {
		const { username } = req.body;

		if (!username) {
			throw new Error();
		}

		let user = getJSON(await User.findOne({ username: username }));

		if (!user) {
			const user_register = new User({
				createdDate: new Date().toISOString(),
				username,
			});

			user = getJSON(await user_register?.save());
		}

		const token = jwt.sign(
			{
				userID: user._id,
				username: username,
			},
			'secretkey',
			{
				expiresIn: '365d',
			}
		);

		res.status(200).send({
			token,
			...user,
		});
	} catch (e) {
		res.status(500).send('error');
	}
};

module.exports = login;
