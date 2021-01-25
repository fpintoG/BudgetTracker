const express = require('express');

const { login, signin, logout } = require('../../controller/v1/login_controller');
const { validateSingup } = require('../../validator/vlogin');

const router = express.Router();

router.post('/login', login);

router.post('/signin', validateSingup, signin);

router.get('/logout', logout);

module.exports = router;
