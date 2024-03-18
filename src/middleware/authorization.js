const jwt = require('jsonwebtoken');

function authorization(req, res, next) {
	try {
		if (req.headers.authorization) {
			const token = req.headers.authorization.replace(/JWT\s|Bearer\s/gi, '');
			if (!token) {
				return res.status(400).send({ message: 'Auth error' });
			}
			try {
				const decoded = jwt.verify(token, process.env.TOKEN_KEY || 'secretkey');
				req.user = decoded;
			} catch (err) {
				return res.status(400).send({ message: 'Auth error' });
			}
		}
	} catch (e) {
		console.log(e);
		return res.status(500).send({
			message: 'No Auth',
		});
	}
	next();
}
module.exports = authorization;
