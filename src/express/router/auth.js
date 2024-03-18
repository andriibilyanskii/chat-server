const express = require('express');
const router = express.Router();

import { login } from './auth/login';

router.post('/auth/login', (req, res) => {
    login(req, res);
});

export { router as authRouter };
