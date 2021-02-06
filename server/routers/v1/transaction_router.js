const express = require('express');

const { listByDailyBudget, makeTransaction } = require('../../controller/v1/transaction_controller');
const { isAuth, isPremium } = require('../../middleware/auth');

const router = express.Router();



/**
 * @swagger
 *
 * /transaction:
 *   post:
 *     description: Make a transaction that will be added to daily budget.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: transaction_date
 *         in: formData
 *         required: true
 *         type: string
 *       - name: category
 *         in: formData
 *         required: true
 *         type: string
 *       - name: amount
 *         in: formData
 *         required: true
 *         type: integer   
 *     responses:
 *       200:
 *         description: Transaction sucessfully added to daily budget.
 *       400:
 *         description: There was a problem alidating transaction data.             
 */
router.post('/transaction', isAuth, makeTransaction);
router.get('/transactions', [isAuth, isPremium], listByDailyBudget);
module.exports = router;
