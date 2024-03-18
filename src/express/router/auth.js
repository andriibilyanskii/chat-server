const express = require('express');
const router = express.Router();

const login = require('./auth/login');

router.post('/auth/login', (req, res) => {
	login(req, res);
});

module.exports = router;
