const express = require('express');

const { login, signin, logout } = require('../../controller/v1/login_controller');
const { validateSingup } = require('../../validator/vlogin');

const router = express.Router();


/**
 * @swagger
 *
 * /login:
 *   post:
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User autenfificated with a token.
 *       401:
 *         description: Could not autentificate user.             
 */
router.post('/login', login);

router.post('/signin', validateSingup, signin);

router.get('/logout', logout);

module.exports = router;
