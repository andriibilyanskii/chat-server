const messages = require('../../../../api/app');

const getMessages = async (req, res) => {
	try {
		const { username, receiverUsername } = req.params;

		if (!username || !receiverUsername) {
			throw new Error();
		}

		const userMessages = messages.messages?.filter(
			(m) =>
				(m?.usernameFrom === username && m?.usernameTo === receiverUsername) ||
				(m?.usernameFrom === receiverUsername && m?.usernameTo === username)
		);

		res.status(200).send({
			messages: userMessages,
		});
	} catch (e) {
		console.log(e);
		res.status(500).send('no username or receiver username');
	}
};

module.exports = getMessages;
