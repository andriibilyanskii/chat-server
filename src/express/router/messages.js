const express = require('express');
const router = express.Router();

const getMessages = require('./messages/getMessages');

router.get('/messages/:username/:receiverUsername', (req, res) => {
	getMessages(req, res);
});

module.exports = router;
