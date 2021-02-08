const express = require('express');

const { listByDailyBudget, 
        makeTransaction } = require('../../controller/v1/transaction_controller');
const { isAuth, isPremium } = require('../../middleware/auth');
const { getActualBudgetId, getBudgetIdByDate } = require('../../middleware/budget')
const { findDailyBudgetId } = require('../../middleware/dailyBudget');

const router = express.Router();

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
 *         description: There was a problem validating transaction data.            
 */
router.post('/transaction', [isAuth, 
                             isPremium, 
                             getActualBudgetId], makeTransaction);

/**
 * @swagger
 *
 * /transactions:
 *   get:
 *     summary: Get transactions of autentificated user in a date range (Date must be in format YYYY-MM-DD).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         type: string
 *         required: true
 *         schema:
 *           example: 2021-01-01  
 *       - in: query
 *         name: end_date
 *         type: string
 *         required: true  
 *         schema:
 *           example: 2021-04-01 
 *     responses:
 *       200:
 *         description: Transaction data sucessfully returned.
 *       400:
 *         description: There was a problem finding transactions.             
 */
router.get('/transactions', [isAuth, 
						isPremium, 
						getBudgetIdByDate,
						findDailyBudgetId], listByDailyBudget);
module.exports = router;
