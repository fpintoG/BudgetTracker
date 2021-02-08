const express = require('express');

const { addTransactionsDate, 
        listByDailyBudget, 
        makeTransaction } = require('../../controller/v1/transaction_controller');
const { isAuth, isPremium } = require('../../middleware/auth');
const { getBudgetIdByDate } = require('../../middleware/budget')
const { findDailyBudgetId } = require('../../middleware/dailyBudget');

const router = express.Router();

router.param('transactionDate', addTransactionsDate)

/**
 * @swagger
 *
 * /transaction:
 *   post:
 *     summary: Make a transaction that will be added to a daily budget (Date format YYYY/MM/DD).
 *     consumes:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: transaction
 *         in: body
 *         schema:
 *           type: object
 *           required:
 *             - transaction_date
 *             - category
 *             - amount 
 *           properties:
 *             transaction_date:
 *               type: string
 *             category:
 *               type: string
 *             amount:
 *               type: integer
 *             description:
 *               type: string 
 *           example:
 *              transaction_date: 2021/02/17
 *              category: comida
 *              amount: 10000
 *              description: Visita a restaurante de comida italiana.
 *     responses:
 *       200:
 *         description: Transaction sucessfully added to daily budget.
 *       400:
 *         description: There was a problem alidating transaction data.            
 */
router.post('/transaction', isAuth, makeTransaction);

/**
 * @swagger
 *
 * /transactions/{transactionDate}:
 *   get:
 *     summary: Get list of transactions by date for that user (Date must be in format YYYY-MM-DD).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionDate
 *         required: true
 *         schema:
 *           type: string
 *           example: 2021-02-17
 *     responses:
 *       200:
 *         description: Returns list of transactions for that date.
 *       400:
 *         description: There was a problem finding transactions for that date.             
 */
router.get('/transactions/:transactionDate', [isAuth, 
                                             isPremium, 
                                             getBudgetIdByDate,
                                             findDailyBudgetId], listByDailyBudget);
module.exports = router;
