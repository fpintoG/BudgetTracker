const express = require('express');

const { login, signin, logout } = require('../../controller/v1/login_controller');
const { validateSingup } = require('../../validator/vlogin');
const { isAuth, isAdmin } = require('../../middleware/auth');

const router = express.Router();


/**
 * @swagger
 *
 * /login:
 *   post:
 *     summary: Get token to put on Authorization header.  
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         in: formData
 *         required: true
 *         schema:
 *           type: string
 *           example: admin@test.com  
 *       - name: password
 *         in: formData
 *         required: true
 *         schema: 
 *           type: string
 *           example: 123456
 *     responses:
 *       200:
 *         description: User autentificated with a token.
 *       401:
 *         description: Could not autentificate user.             
 */
router.post('/login', login);

/**
 * @swagger
 *
 * /signin:
 *   post:
 *     summary: Create a new user.
 *     consumes:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: signin
 *         in: body
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - email
 *             - password 
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             role:
 *               type: string 
 *           example:
 *              name: Carlos
 *              email: normal_user@test.com
 *              password: 123456aA@
 *              role: NORMAL_ROLE.
 *     responses:
 *       200:
 *         description: User was created.
 *       400:
 *         description: Did not pass validation.            
 */
router.post('/signin', [isAuth, isAdmin], validateSingup, signin);

router.get('/logout', logout);

module.exports = router;
